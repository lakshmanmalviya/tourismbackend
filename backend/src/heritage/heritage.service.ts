import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Heritage } from './heritage.entity';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { ImageService } from '../image/image.service';
import { EntityType } from 'src/types/entityType.enum';
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

    const heritage = this.heritageRepository.create({ name, description, tags: JSON.parse(tagIds), place });

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
      throw new BadRequestException('Error creating heritage or uploading images');
    }
  }
}
