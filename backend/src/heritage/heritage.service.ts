import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Heritage } from './heritage.entity';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { UpdateHeritageDto } from './dto/update-heritage.dto';
import { ImageService } from '../image/image.service';
import { EntityType } from 'src/types/entityType.enum';
import { PlaceService } from 'src/place/place.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class HeritageService {
  constructor(
    @InjectRepository(Heritage)
    private heritageRepository: Repository<Heritage>,
    private readonly imageService: ImageService,
    private readonly placeService: PlaceService,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  async createHeritage(
    createHeritageDto: CreateHeritageDto,
    files: { images?: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ): Promise<Heritage> {
    const { name, description, tags, placeId, mapUrl } = createHeritageDto;
    const { images, thumbnail } = files;
    
    const place = await this.placeService.findPlaceDetailsById(placeId);

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const heritage = this.heritageRepository.create({
      name,
      description,
      tags: JSON.parse(tags),
      mapUrl,
    });

    const savedHeritage = await this.heritageRepository.save(heritage);
    savedHeritage.place = place;

    heritage.thumbnailUrl = await this.imageService.handleThumbnailUpload(
      savedHeritage.id,
      EntityType.HERITAGE,
      thumbnail,
    );

    this.imageService.handleImagesUpload(
      savedHeritage.id,
      EntityType.HERITAGE,
      images,
    );
    return await this.heritageRepository.save(heritage);
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{ data: Heritage[]; totalCount: number; totalPages: number }> {
    const { page, limit } = paginationDto;
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const offset = (pageNumber - 1) * pageSize;

    const heritagesResult = await this.datasource.query(
      `SELECT h.*,
          JSON_OBJECT(
            'id', p.id,
            'name', p.name,
            'description', p.description,
            'thumbnailUrl', p.thumbnailUrl
          ) AS place,
          COALESCE(
            JSON_ARRAYAGG(
              JSON_OBJECT('id', img.id, 'imageLink', img.imageLink)
            ), '[]'
          ) AS images
        FROM heritage h
        INNER JOIN place p ON h.placeId = p.id
        LEFT JOIN image img ON img.entityId = h.id
        AND img.entityType = 'HERITAGE'
        AND img.isDeleted = false
        WHERE h.isDeleted = false
        GROUP BY h.id, p.id
        LIMIT ? OFFSET ?`,
      [pageSize, offset],
    );

    if (!heritagesResult || heritagesResult.length === 0) {
      throw new NotFoundException(`No heritages found`);
    }

    const [totalCountResult] = await this.datasource.query(
      `SELECT COUNT(*) AS totalCount FROM heritage WHERE isDeleted = false`,
    );

    const totalCount = parseInt(totalCountResult.totalCount, 10);
    const totalPages = Math.ceil(totalCount / pageSize);

    const heritages = heritagesResult.map((heritage: any) => ({
      id: heritage.id,
      name: heritage.name,
      description: heritage.description,
      thumbnailUrl: heritage.thumbnailUrl,
      mapUrl: heritage.mapUrl,
      isDeleted: heritage.isDeleted,
      place: heritage.place,
      images: heritage.images ? JSON.parse(heritage.images) : [],
    }));

    return {
      data: heritages,
      totalCount,
      totalPages,
    };
  }

  async findOne(id: string): Promise<{ heritage: Heritage }> {
    const heritageResult = await this.datasource.query(
      `SELECT h.id,
      h.name,
      h.description,
      h.thumbnailUrl,
      h.mapUrl,
      h.isDeleted,
        JSON_OBJECT(
          'id', p.id,
          'name', p.name,
          'description', p.description
          'thumbnailUrl', p.thumbnailUrl,
        ) AS place,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT('id', img.id, 'imageLink', img.imageLink)
          ), '[]'
        ) AS images
      FROM heritage h
      INNER JOIN place p ON h.placeId = p.id
      LEFT JOIN image img ON img.entityId = h.id
      AND img.entityType = 'HERITAGE'
      AND img.isDeleted = false
      WHERE h.id = ? AND h.isDeleted = false
      GROUP BY h.id, p.id`,
      [id],
    );

    if (!heritageResult || heritageResult.length === 0) {
      throw new NotFoundException(`Heritage with id ${id} not found`);
    }

    const heritage = heritageResult[0];

    heritage.images = heritage.images ? JSON.parse(heritage.images) : [];

    return { heritage };
  }

  async update(
    id: string,
    updateHeritageDto: UpdateHeritageDto,
    thumbnail?: Express.Multer.File[],
  ): Promise<Heritage> {
    const heritage = await this.heritageRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!heritage) {
      throw new NotFoundException('Heritage not found');
    }

    if (thumbnail) {
      await this.imageService.deleteImageByUrl(heritage.thumbnailUrl);

      heritage.thumbnailUrl = await this.imageService.handleThumbnailUpload(
        heritage.id,
        EntityType.PLACE,
        thumbnail,
      );
    }

    if (updateHeritageDto.tags) {
      heritage.tags = JSON.parse(updateHeritageDto.tags);
    }

    Object.assign(heritage, updateHeritageDto);

    const updatedHeritage = await this.heritageRepository.save(heritage);

    return updatedHeritage;
  }

  async remove(id: string): Promise<void> {
    const heritage = await this.heritageRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!heritage) {
      throw new NotFoundException(`Heritage with ID ${id} not found`);
    }

    await this.imageService.deleteImagesByEntity(id, EntityType.HERITAGE);
    await this.heritageRepository.update(id, { isDeleted: true });
  }
}
