import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Heritage } from './heritage.entity';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { UpdateHeritageDto } from './dto/update-heritage.dto';
import { ImageService } from '../image/image.service';
import { EntityType } from 'src/types/entityType.enum';
import { Image } from 'src/image/image.entity';
import { PlaceService } from 'src/place/place.service';

@Injectable()
export class HeritageService {
  constructor(
    @InjectRepository(Heritage)
    private heritageRepository: Repository<Heritage>,
    private readonly imageService: ImageService,
    private readonly placeService: PlaceService,
  ) {}

  async create(
    createHeritageDto: CreateHeritageDto,
    files: Express.Multer.File[],
  ): Promise<Heritage> {
    const { name, description, tagIds, placeId } = createHeritageDto;
    const place = await this.placeService.getPlaceById(+placeId);

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const heritage = this.heritageRepository.create({
      name,
      description,
      tags: JSON.parse(tagIds),
      place,
    });

    try {
      const savedHeritage = await this.heritageRepository.save(heritage);

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          const createImageDto = {
            entityType: EntityType.HERITAGE,
            entityId: savedHeritage.id.toString(),
          };
          return this.imageService.uploadImage(file, createImageDto);
        });

        await Promise.all(uploadPromises);
      }

      return savedHeritage;
    } catch (error) {
      throw new BadRequestException(
        'Error creating heritage or uploading images',
      );
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: { heritage: Heritage; images: Image[] }[]; totalCount: number; totalPages: number }> {
    try {
      const [heritages, totalCount] = await this.heritageRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        where: { isDeleted: false },
      });

      const totalPages = Math.ceil(totalCount / limit);

      const heritageWithImages = await Promise.all(
        heritages.map(async (heritage) => {
          const images = await this.imageService.getImagesByEntity(
            heritage.id.toString(),
          );
          return { heritage, images };
        }),
      );

      return {
        data: heritageWithImages,
        totalCount,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all heritages');
    }
  }

  async findByTag(
    tagId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: { heritage: Heritage; images: Image[] }[]; totalCount: number; totalPages: number }> {
    try {
      const [heritages, totalCount] = await this.heritageRepository
        .createQueryBuilder('heritage')
        .where(
          new Brackets((qb) => {
            qb.where('JSON_CONTAINS(heritage.tags, :tagId)', {
              tagId: `[${tagId}]`,
            });
          }),
        )
        .andWhere('heritage.isDeleted = false')
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(totalCount / limit);

      const heritageWithImages = await Promise.all(
        heritages.map(async (heritage) => {
          const images = await this.imageService.getImagesByEntity(
            heritage.id.toString(),
          );
          return { heritage, images };
        }),
      );

      return {
        data: heritageWithImages,
        totalCount,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages by tag');
    }
  }

  async findOne(id: number): Promise<{ heritage: Heritage; images: Image[] }> {
    try {
      const heritage = await this.heritageRepository.findOne({ where: { id } });

      if (!heritage) {
        throw new NotFoundException(`Heritage with ID ${id} not found`);
      }

      const images = await this.imageService.getImagesByEntity(id.toString());
      return { heritage, images };
    } catch (error) {
      throw new BadRequestException(`Error fetching heritage with ID: ${id}`);
    }
  }

  async findByPlaceId(
    placeId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Heritage[]; totalCount: number; totalPages: number }> {
    try {
      const place = await this.placeService.getPlaceById(placeId);
      const [heritages, totalCount] = await this.heritageRepository.findAndCount({
        where: { place, isDeleted: false },
        skip: (page - 1) * limit,
        take: limit,
      });

      const totalPages = Math.ceil(totalCount / limit);

      return {
        data: heritages,
        totalCount,
        totalPages,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages by place ID');
    }
  }
  
  async update(
    id: number,
    updateHeritageDto: UpdateHeritageDto,
    files: Express.Multer.File[],
  ): Promise<Heritage> {
    try {
      const heritage = await this.heritageRepository.findOne({ where: { id } });

      if (!heritage) {
        throw new NotFoundException('Heritage not found');
      }

      Object.assign(heritage, updateHeritageDto);

      const updatedHeritage = await this.heritageRepository.save(heritage);

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          const createImageDto = {
            entityType: EntityType.HERITAGE,
            entityId: updatedHeritage.id.toString(),
          };
          return this.imageService.uploadImage(file, createImageDto);
        });

        await Promise.all(uploadPromises);
      }

      return updatedHeritage;
    } catch (error) {
      throw new BadRequestException(
        'Error updating heritage or uploading images',
      );
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const heritage = await this.heritageRepository.findOne({ where: { id } });

      if (!heritage) {
        throw new NotFoundException(`Heritage with ID ${id} not found`);
      }

      await this.imageService.deleteImagesByEntity(id.toString());
      await this.heritageRepository.update(id, { isDeleted: true });
    } catch (error) {
      throw new BadRequestException(
        'Error deleting heritage or associated images',
      );
    }
  }
}
