import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private readonly imageService: ImageService,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

  async findAll(
    query: GetHotelDto,
  ): Promise<{ data: Hotel[]; total: number; page: number; limit: number }> {
    const { ownerId, page = 1, limit = 5 } = query;
    const skip = (page - 1) * limit;

    try {
      if (ownerId) {
        const owner = await this.userService.findUserById(ownerId);

        const [hotels, total] = await this.hotelRepository.findAndCount({
          where: { owner, isDeleted: false },
          take: limit,
          skip: skip,
        });

        if (hotels.length > 0) {
          return { data: hotels, total, page, limit };
        }
        throw new NotFoundException('No hotels found for the given user');
      } else {
        const [hotels, total] = await this.hotelRepository.findAndCount({
          where: { isDeleted: false },
          take: limit,
          skip: skip,
        });
        return { data: hotels, total, page, limit };
      }
    } catch (error) {
      throw new BadRequestException('Error fetching hotels');
    }
  }

  async findOne(id: string): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async findPending(
    paginationDto: PaginationDto,
  ): Promise<{ data: Hotel[]; total: number; page: number; limit: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [hotels, total] = await this.hotelRepository.findAndCount({
      where: {
        registrationStatus: RegistrationStatus.PENDING,
        isDeleted: false,
      },
      take: limit,
      skip: skip,
    });
    return { data: hotels, total, page, limit };
  }
  async findByPlaceId(
    placeId: string,
    paginationDto: PaginationDto,
  ): Promise<{ data: Hotel[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const place = await this.placeService.findById(placeId);

      if (!place) {
        throw new NotFoundException(`Place with ID ${placeId} not found`);
      }

      const [hotels, total] = await this.hotelRepository.findAndCount({
        where: { place, isDeleted: false },
        relations: ['place', 'user'],
        take: limit,
        skip: skip,
      });
      return { data: hotels, total };
    } catch (err) {
      throw new BadRequestException('Error fetching hotels by place id');
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

    let registrationStatus = RegistrationStatus.PENDING;
    const place = await this.placeService.findById(placeId);

    if (!place) {
      throw new NotFoundException(`Place with ID ${placeId} not found`);
    }

    const user = await this.userService.findUserById(userId);

    if (user.role === 'ADMIN') {
      registrationStatus = RegistrationStatus.ACCEPTED;
    }

    const hotel = this.hotelRepository.create({
      name,
      description,
      owner: user,
      hotelStarRating,
      address,
      availableRooms,
      price,
      place,
      registrationStatus,
      websiteLink,
      mapUrl,
      contact,
    });
    const savedHotel = await this.hotelRepository.save(hotel);

    hotel.thumbnailUrl = await this.imageService.handleThumbnailUpload(
      hotel.id,
      EntityType.HOTEL,
      thumbnail,
    );

    await this.imageService.handleImagesUpload(
      savedHotel.id,
      EntityType.HOTEL,
      images,
    );
    return await this.hotelRepository.save(savedHotel);
  }

  async update(
    id: string,
    updateHotelDto: UpdateHotelDto,
    files: Express.Multer.File[],
  ): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    } else {
      const user = await this.userService.findUserById(
        hotel.owner.id,
      );

      if (user.role === Role.PROVIDER) {
        hotel.registrationStatus = RegistrationStatus.PENDING;
      }
    }
    Object.assign(hotel, updateHotelDto);
    hotel.updatedAt = new Date();

    try {
      await this.imageService.handleImagesUpload(
        hotel.id,
        EntityType.HOTEL,
        files,
      );

      return this.hotelRepository.save(hotel);
    } catch (error) {
      throw new BadRequestException('Error updating hotel');
    }
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
