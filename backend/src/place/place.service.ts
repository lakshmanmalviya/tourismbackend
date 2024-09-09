import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Place } from './place.entity';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { ImageService } from '../image/image.service';
import { EntityType } from 'src/types/entityType.enum';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class PlaceService {
  constructor(
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
    private readonly imageService: ImageService,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}
  
  async findById(id: string): Promise<Place> {
    const place = await this.datasource.query(
      `SELECT p.*,
              (SELECT JSON_ARRAYAGG(
                          JSON_OBJECT('imageLink', img.imageLink, 'publicId', img.publicId)
                      )
               FROM image img 
               WHERE img.entityId = p.id 
               AND img.entityType = 'PLACE'
               AND img.isDeleted = false
              ) AS images
       FROM place p
       WHERE p.id = ?`,
      [id],
    );

    if (!place.length) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }

    return place[0];
  }

  //Find place without images
  async findPlaceDetailsById(id: string): Promise<Place> {
    const place = await this.datasource.query(
      `SELECT p.id, p.name, p.description, p.thumbnailUrl 
       FROM place p
       WHERE p.id = ?`,
      [id],
    );
  
    if (!place.length) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }
  
    return place[0];
  }

  // async findById(id: string): Promise<Place> {
  //   const place = await this.datasource.query(
  //     `SELECT p.* , img.imageLink, img.publicId
  //       FROM place p
  //       INNER JOIN image img ON p.id = img.entityId AND img.entityType = 'PLACE' AND img.isDeleted = false
  //       WHERE p.id = ?`,
  //     [id],
  //   );

  //   if (!place) {
  //     throw new NotFoundException(`Place with ID ${id} not found`);
  //   }
  //   return place;
  // }

  async findAll(paginationDto: PaginationDto): Promise<{
    data: Place[];
    totalCount: number;
    totalPages: number;
  }> {
    const { page, limit } = paginationDto;
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const offset = (pageNumber - 1) * pageSize;

    const places = await this.datasource.query(
      `SELECT p.*, 
              GROUP_CONCAT(
                  JSON_OBJECT('imageLink', img.imageLink, 'publicId', img.publicId) 
                  ORDER BY img.imageLink ASC
              ) as images
       FROM place p
       LEFT JOIN image img 
       ON p.id = img.entityId 
       AND img.entityType = 'PLACE' 
       AND img.isDeleted = false
       GROUP BY p.id
       ORDER BY p.id
       LIMIT ? OFFSET ?`,
      [pageSize, offset],
    );

    const [totalCountResult] = await this.datasource.query(
      `SELECT COUNT(DISTINCT p.id) as totalCount
       FROM place p
       LEFT JOIN image img 
       ON p.id = img.entityId 
       AND img.entityType = 'PLACE' 
       AND img.isDeleted = false`,
    );

    const totalCount = parseInt(totalCountResult.totalCount, 10);
    const totalPages = Math.ceil(totalCount / pageSize);

    return {
      data: places.map((place) => ({
        ...place,
        images: place.images ? JSON.parse(`[${place.images}]`) : [],
      })),
      totalCount,
      totalPages,
    };
  }

  // async findAll(paginationDto: PaginationDto): Promise<{
  //   data: Place[];
  //   totalCount: number;
  //   totalPages: number;
  // }> {
  //   const { page, limit } = paginationDto;
  //   const pageNumber = Math.max(1, page);
  //   const pageSize = Math.max(1, limit);
  //   const offset = (pageNumber - 1) * pageSize;

  //   const places = await this.datasource.query(
  //     `SELECT p.*, img.imageLink, img.publicId
  //      FROM place p
  //      LEFT JOIN image img
  //      ON p.id = img.entityId AND img.entityType = 'PLACE'
  //      AND
  //      img.isDeleted = false
  //      ORDER BY p.id
  //      LIMIT ? OFFSET ?`,
  //     [pageSize, offset],
  //   );

  //   const [totalCountResult] = await this.datasource.query(
  //     `SELECT COUNT(DISTINCT p.id) as totalCount
  //      FROM place p
  //      LEFT JOIN image img
  //      ON p.id = img.entityId AND img.entityType = 'PLACE' AND img.isDeleted = false`,
  //   );

  //   const totalCount = parseInt(totalCountResult.totalCount, 10);
  //   const totalPages = Math.ceil(totalCount / pageSize);

  //   return {
  //     data: places,
  //     totalCount,
  //     totalPages,
  //   };
  // }

  async createPlace(
    createPlaceDto: CreatePlaceDto,
    files: { images?: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ): Promise<Place> {
    const { images, thumbnail } = files;

    const place = this.placeRepository.create(createPlaceDto);

    const savedPlace = await this.placeRepository.save(place);

    place.thumbnailUrl = await this.imageService.handleThumbnailUpload(
      savedPlace.id,
      EntityType.PLACE,
      thumbnail,
    );

    await this.imageService.handleImagesUpload(
      savedPlace.id,
      EntityType.PLACE,
      images,
    );
    return await this.placeRepository.save(place);
  }

  async updatePlace(
    id: string,
    updatePlaceDto: UpdatePlaceDto,
  ): Promise<Place> {
    const place = await this.placeRepository.findOne({ where: { id } });

    if (!place) {
      throw new NotFoundException(`Place with id ${id} not found`);
    }

    Object.assign(place, updatePlaceDto);

    return await this.placeRepository.save(place);
  }

  async deletePlace(id: string): Promise<void> {
    const place = await this.placeRepository.findOne({ where: { id } });

    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }

    try {
      await this.imageService.deleteImagesByEntity(id);
      await this.placeRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(
        'Error deleting place or associated images',
      );
    }
  }
}
