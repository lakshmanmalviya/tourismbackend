import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
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
    const { name, description, tagIds, placeId, mapUrl } = createHeritageDto;
    const { images, thumbnail } = files;
    const place = await this.placeService.findPlaceDetailsById(placeId);

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const heritage = this.heritageRepository.create({
      name,
      description,
      tags: JSON.parse(tagIds),
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

  // async findAll(paginationDto: PaginationDto): Promise<{
  //   data: Heritage[];
  //   totalCount: number;
  //   totalPages: number;
  // }> {
  //   const { page, limit } = paginationDto;
  //   const pageNumber = Math.max(1, page);
  //   const pageSize = Math.max(1, limit);
  //   const offset = (pageNumber - 1) * pageSize;
  
  //   try {
  //     const heritages = await this.datasource.query(
  //       `SELECT h.id, h.name, h.description, h.thumbnailUrl, h.mapUrl, h.isDeleted,
  //               p.name AS placeName, p.description AS placeDescription,
  //               COALESCE(
  //                 (
  //                   SELECT JSON_ARRAYAGG(img.imageLink)
  //                   FROM image img
  //                   WHERE img.entityId = h.id
  //                     AND img.entityType = 'HERITAGE'
  //                     AND img.isDeleted = false
  //                 ), '[]'
  //               ) AS imageLinks
  //        FROM heritage h
  //        LEFT JOIN place p ON h.placeId = p.id
  //        GROUP BY h.id, h.name, h.description, h.thumbnailUrl, h.mapUrl, h.isDeleted, p.name, p.description
  //        ORDER BY h.id
  //        LIMIT ? OFFSET ?`,
  //       [pageSize, offset]
  //     );
  
  //     const [totalCountResult] = await this.datasource.query(
  //       `SELECT COUNT(DISTINCT h.id) AS totalCount
  //        FROM heritage h`
  //     );
  
  //     const totalCount = parseInt(totalCountResult.totalCount, 10);
  //     const totalPages = Math.ceil(totalCount / pageSize);
  
  //     return {
  //       data: heritages.map((heritage) => ({
  //         ...heritage,
  //         imageLinks: Array.isArray(heritage.imageLinks)
  //           ? heritage.imageLinks
  //           : JSON.parse(heritage.imageLinks || '[]'),
  //       })),
  //       totalCount,
  //       totalPages,
  //     };
  //   } catch (error) {
  //     console.log('Error in findAll:', error);
  //     throw new InternalServerErrorException('An error occurred while fetching heritages');
  //   }
  // }
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<{
    data: any[];
    totalCount: number;
    totalPages: number;
  }> {
    const { page, limit } = paginationDto;
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const offset = (pageNumber - 1) * pageSize;
  
    try {

      const hotelsQuery = `
        SELECT h.id, h.name, h.description, h.thumbnailUrl, h.mapUrl, h.isDeleted,
               p.id AS placeId, p.name AS placeName, p.description AS placeDescription,
               u.id AS userId, u.name AS userName, u.email AS userEmail, u.role AS userRole,
               COALESCE(
                 (
                   SELECT JSON_ARRAYAGG(img.imageLink)
                   FROM image img
                   WHERE img.entityId = h.id AND img.entityType = 'HOTEL' AND img.isDeleted = false
                 ), '[]'
               ) AS imageLinks
        FROM hotel h
        LEFT JOIN place p ON h.placeId = p.id
        LEFT JOIN user u ON h.ownerId = u.id
        LEFT JOIN image i ON i.entityId = h.id AND i.entityType = 'HOTEL'
        WHERE h.isDeleted = false
        GROUP BY h.id, p.id, u.id
        ORDER BY h.id
        LIMIT ? OFFSET ?
      `;
  
      const hotels = await this.datasource.query(hotelsQuery, [pageSize, offset]);
  
      // Query to get the total count of hotels
      const [totalCountResult] = await this.datasource.query(
        `SELECT COUNT(*) AS totalCount FROM hotel WHERE isDeleted = false`
      );
  
      const totalCount = parseInt(totalCountResult.totalCount, 10);
      const totalPages = Math.ceil(totalCount / pageSize);
  
      // Format data
      const formattedHotels = hotels.map((hotel: any) => ({
        ...hotel,
        imageLinks: Array.isArray(hotel.imageLinks)
          ? hotel.imageLinks
          : JSON.parse(hotel.imageLinks || '[]'),
      }));
  
      return {
        data: formattedHotels,
        totalCount,
        totalPages,
      };
    } catch (error) {
      console.log('Error in findAll:', error);
      throw new InternalServerErrorException('An error occurred while fetching hotels');
    }
  }
  

  async findOne(id: string): Promise<{ heritage: Heritage }> {
    const heritageResult = await this.datasource.query(
      `SELECT h.id,
      h.name,
      h.description,
      h.thumbnailUrl,
      h.mapUrl,
      h.isDeleted,
      p.id AS placeId,
      p.name AS placeName,
      p.description AS placeDescription,
        COALESCE(
          (
            SELECT JSON_ARRAYAGG(img.imageLink)
            FROM image img
            WHERE img.entityId = h.id
                AND img.entityType = 'HERITAGE'
                AND img.isDeleted = false
                ), '[]'
          ) AS imageLinks
       FROM heritage h
       INNER JOIN place p ON h.placeId = p.id
       WHERE h.id = ?`,
      [id],
    );

    if (!heritageResult || heritageResult.length === 0) {
      throw new NotFoundException(`Heritage with id ${id} not found`);
    }

    const heritage = heritageResult[0];

    heritage.imageLinks = heritage.imageLinks
      ? JSON.parse(heritage.imageLinks)
      : [];

    return { heritage };
  }

  async update(
    id: string,
    updateHeritageDto: UpdateHeritageDto,
    files: Express.Multer.File[],
  ): Promise<Heritage> {
    const heritage = await this.heritageRepository.findOne({ where: { id } });

    if (!heritage) {
      throw new NotFoundException('Heritage not found');
    }

    Object.assign(heritage, updateHeritageDto);

    const updatedHeritage = await this.heritageRepository.save(heritage);

    await this.imageService.handleImagesUpload(id, EntityType.HERITAGE, files);

    return updatedHeritage;
  }

  async remove(id: string): Promise<void> {
    const heritage = await this.heritageRepository.findOne({ where: { id } });

    if (!heritage) {
      throw new NotFoundException(`Heritage with ID ${id} not found`);
    }

    await this.imageService.deleteImagesByEntity(id);
    await this.heritageRepository.update(id, { isDeleted: true });
  }
}
