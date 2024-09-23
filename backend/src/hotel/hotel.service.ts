import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { ImageService } from '../image/image.service';
import { PlaceService } from '../place/place.service';
import { EntityType } from 'src/types/entityType.enum';
import { RegistrationStatus } from 'src/types/registrationStatus.enum';
import { UserService } from 'src/user/user.service';
import { Hotel } from './hotel.entity';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Role } from 'src/types/roles.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { GetHotelDto } from './dto/get-hotel.dto';
import { HotelResponse } from 'src/search/dto/search-response.dto';
import { HotelResponseDto, HotelsResponseDto } from './dto/hotel-response.dto';
import { plainToClass } from 'class-transformer';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private readonly imageService: ImageService,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
    @InjectDataSource() private readonly datasource: DataSource,
  ) {}

  async findAll(queryParam: GetHotelDto): Promise<HotelsResponseDto> {
    const { page = 1, limit = 5, ownerId } = queryParam;
    const pageNumber = page;
    const pageSize = limit;
    const offset = (pageNumber - 1) * pageSize;

    let baseQuery = `
    SELECT h.*,
           JSON_OBJECT(
             'id', p.id,
             'name', p.name,
             'description', p.description
           ) AS place,
           JSON_OBJECT(
             'id', u.id,
             'name', u.username,
             'email', u.email,
             'role', u.role
           ) AS owner,
           COALESCE(
             JSON_ARRAYAGG(
               JSON_OBJECT('id', img.id, 'link', img.imageLink)
             ), '[]'
           ) AS images
    FROM hotel h
    LEFT JOIN place p ON h.placeId = p.id
    LEFT JOIN user u ON h.ownerId = u.id
    LEFT JOIN image img ON img.entityId = h.id
                       AND img.entityType = 'HOTEL'
                       AND img.isDeleted = false
    WHERE h.isDeleted = false
  `;

    if (ownerId) {
      baseQuery += ` AND h.ownerId = ? `;
    }

    baseQuery += `
    GROUP BY h.id, p.id, u.id
    ORDER BY h.id
    LIMIT ? OFFSET ?
  `;

    try {
      const queryParams = ownerId
        ? [ownerId, pageSize, offset]
        : [pageSize, offset];

      const hotels = await this.datasource.query(baseQuery, queryParams);

      let countQuery = `SELECT COUNT(*) AS totalCount FROM hotel WHERE isDeleted = false`;
      const countParams = [];
      if (ownerId) {
        countQuery += ` AND ownerId = ?`;
        countParams.push(ownerId);
      }

      const [totalCountResult] = await this.datasource.query(
        countQuery,
        countParams,
      );

      const totalCount = parseInt(totalCountResult.totalCount, 10);
      const totalPages = Math.ceil(totalCount / pageSize);

      const formattedHotels = hotels.map((hotel: any) => ({
        ...hotel,
        images: hotel.images ? JSON.parse(hotel.images) : [],
      }));

      return {
        data: formattedHotels,
        totalCount,
        totalPages,
        limit,
      };
    } catch (error) {
      console.error('Error in findAll:', error);
    }
  }

  async findOne(id: string): Promise<HotelResponseDto> {
    const hotelResult = await this.datasource.query(
      `SELECT h.*,
                 JSON_OBJECT(
                   'id', p.id,
                   'name', p.name,
                   'description', p.description
                 ) AS place,
                 JSON_OBJECT(
                   'id', u.id,
                   'name', u.username,
                   'email', u.email,
                   'role', u.role
                 ) AS owner,
                 COALESCE(
                   JSON_ARRAYAGG(
                     JSON_OBJECT('id', img.id, 'link', img.imageLink)
                   ), '[]'
                 ) AS images
          FROM hotel h
          LEFT JOIN place p ON h.placeId = p.id
          LEFT JOIN user u ON h.ownerId = u.id
          LEFT JOIN image img ON img.entityId = h.id
                             AND img.entityType = 'HOTEL'
                             AND img.isDeleted = false
          WHERE h.isDeleted = false
          AND h.id = ?
          GROUP BY h.id, p.id, u.id`,
      [id],
    );

    if (!hotelResult || hotelResult.length === 0) {
      throw new NotFoundException('Hotel not found');
    }

    const hotel = hotelResult[0];

    return {
      ...hotel,
      images: hotel.images ? JSON.parse(hotel.images) : [],
    };
  }

  async findPending(
    paginationDto: PaginationDto,
  ): Promise<HotelsResponseDto> {
    const { page, limit } = paginationDto;
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const offset = (pageNumber - 1) * pageSize;

    try {
      const hotels = await this.datasource.query(
        `SELECT h.*,
                 JSON_OBJECT(
                   'id', p.id,
                   'name', p.name,
                   'description', p.description
                 ) AS place,
                 JSON_OBJECT(
                   'id', u.id,
                   'name', u.username,
                   'email', u.email,
                   'role', u.role
                 ) AS owner,
                 COALESCE(
                   JSON_ARRAYAGG(
                     JSON_OBJECT('id', img.id, 'link', img.imageLink)
                   ), '[]'
                 ) AS images
          FROM hotel h
          LEFT JOIN place p ON h.placeId = p.id
          LEFT JOIN user u ON h.ownerId = u.id
          LEFT JOIN image img ON img.entityId = h.id
                             AND img.entityType = 'HOTEL'
                             AND img.isDeleted = false
          WHERE h.isDeleted = false
          AND h.registrationStatus = 'PENDING'
          GROUP BY h.id, p.id, u.id
          LIMIT ? OFFSET ?`,
        [pageSize, offset],
      );

      const [totalCountResult] = await this.datasource.query(
        `SELECT COUNT(*) AS totalCount FROM hotel 
         WHERE isDeleted = false 
         AND registrationStatus = 'PENDING'`,
      );

      const total = parseInt(totalCountResult.totalCount, 10);

      const formattedHotels = hotels.map((hotel: any) => ({
        ...hotel,
        images: hotel.images ? JSON.parse(hotel.images) : [],
      }));

      return {
        data: formattedHotels,
        totalCount: total,
        totalPages: pageNumber,
        limit: pageSize,
      };
    } catch (error) {
      console.error('Error in findPending:', error);
    }
  }

  async create(
    createHotelDto: CreateHotelDto,
    files: { images?: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ): Promise<Hotel> {
    const {
      name,
      description,
      placeId,
      userId,
      hotelStarRating,
      address,
      availableRooms,
      price,
      websiteLink,
      mapUrl,
      contact,
    } = createHotelDto;
    const { images, thumbnail } = files;

    const place = await this.placeService.findPlaceDetailsById(placeId);

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const user = await this.userService.findUserById(userId);

    const hotel = this.hotelRepository.create({
      name,
      description,
      owner: user,
      hotelStarRating,
      address,
      availableRooms,
      price,
      place,
      websiteLink,
      mapUrl,
      contact,
    });

    if (user.role === 'ADMIN') {
      hotel.registrationStatus = RegistrationStatus.ACCEPTED;
    } else hotel.registrationStatus = RegistrationStatus.PENDING;

    const savedHotel = await this.hotelRepository.save(hotel);

    hotel.thumbnailUrl = await this.imageService.handleThumbnailUpload(
      hotel.id,
      EntityType.HOTEL,
      thumbnail,
    );

    this.imageService.handleImagesUpload(
      savedHotel.id,
      EntityType.HOTEL,
      images,
    );
    return await this.hotelRepository.save(savedHotel);
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelDto,
    thumbnail: Express.Multer.File[],
  ): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
      relations: { owner: true },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }
    const user = await this.userService.findUserById(hotel.owner.id);

    if (user.role === Role.PROVIDER) {
      hotel.registrationStatus = RegistrationStatus.PENDING;
    }

    if (thumbnail) {
      hotel.thumbnailUrl = await this.imageService.handleThumbnailUpload(
        hotel.id,
        EntityType.HOTEL,
        thumbnail,
      );
    }

    Object.assign(hotel, updateHotelDto);
    hotel.updatedAt = new Date();

    return this.hotelRepository.save(hotel);
  }

  async updateStatus(id: string, status: RegistrationStatus): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    hotel.registrationStatus = status;
    hotel.updatedAt = new Date();

    return this.hotelRepository.save(hotel);
  }

  async softDelete(id: string): Promise<void> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    hotel.isDeleted = true;
    await this.hotelRepository.save(hotel);
  }
}
