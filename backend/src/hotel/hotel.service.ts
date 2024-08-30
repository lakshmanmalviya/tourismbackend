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
    ownerId: number,
    paginationDto: PaginationDto,
  ): Promise<{ data: Hotel[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      if (ownerId) {
        const user = await this.userService.findUserById(ownerId);

        const [hotels, total] = await this.hotelRepository.findAndCount({
          where: { user, isDeleted: false },
          relations: ['place', 'user'],
          take: limit,
          skip: skip,
        });

        if (hotels.length > 0) {
          return { data: hotels, total };
        }
        throw new NotFoundException('No hotels found for the given user');
      } else {
        const [hotels, total] = await this.hotelRepository.findAndCount({
          where: { isDeleted: false },
          relations: ['place', 'user'],
          take: limit,
          skip: skip,
        });
        return { data: hotels, total };
      }
    } catch (error) {
      throw new BadRequestException('Error fetching hotels');
    }
  }

  async findOne(id: number): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
      relations: ['place', 'user'],
    });

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }

  async findPending(
    paginationDto: PaginationDto,
  ): Promise<{ data: Hotel[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    const [hotels, total] = await this.hotelRepository.findAndCount({
      where: {
        registrationStatus: RegistrationStatus.PENDING,
        isDeleted: false,
      },
      relations: ['place', 'user'],
      take: limit,
      skip: skip,
    });
    return { data: hotels, total };
  }

  async create(
    createHotelDto: CreateHotelDto,
    files: Express.Multer.File[],
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
    } = createHotelDto;
    let registrationStatus = RegistrationStatus.PENDING;
    const place = await this.placeService.getPlaceById(+placeId);

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
      place,
      user: { id: userId },
      hotelStarRating,
      address,
      availableRooms,
      price,
      registrationStatus,
    });

    try {
      const savedHotel = await this.hotelRepository.save(hotel);

      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          const createImageDto = {
            entityType: EntityType.HOTEL,
            entityId: savedHotel.id.toString(),
          };
          return this.imageService.uploadImage(file, createImageDto);
        });

        await Promise.all(uploadPromises);
      }

      return savedHotel;
    } catch (error) {
      throw new BadRequestException('Error creating hotel or uploading images');
    }
  }

  async findByPlaceId(
    placeId: number,
    paginationDto: PaginationDto,
  ): Promise<{ data: Hotel[]; total: number }> {
    const { page, limit } = paginationDto;
    const skip = (page - 1) * limit;

    try {
      const [hotels, total] = await this.hotelRepository.findAndCount({
        where: { placeId, isDeleted: false },
        relations: ['place', 'user'],
        take: limit,
        skip: skip,
      });
      return { data: hotels, total };
    } catch (err) {
      throw new BadRequestException('Error fetching hotels by place id');
    }
  }

  async update(
    id: number,
    updateHotelDto: UpdateHotelDto,
    files: Express.Multer.File[],
  ): Promise<Hotel> {
    const hotel = await this.hotelRepository.findOne({
      where: { id, isDeleted: false },
    });
    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    } else {
      const user = await this.userService.findUserById(hotel.userId);

      if (user.role === Role.PROVIDER) {
        hotel.registrationStatus = RegistrationStatus.PENDING;
      }
    }
    Object.assign(hotel, updateHotelDto);
    hotel.updatedAt = new Date();

    try {
      const updatedHotel = await this.hotelRepository.save(hotel);
      if (files && files.length > 0) {
        const uploadPromises = files.map((file) => {
          const createImageDto = {
            entityType: EntityType.HOTEL,
            entityId: updatedHotel.id.toString(),
          };
          return this.imageService.uploadImage(file, createImageDto);
        });

        await Promise.all(uploadPromises);
      }

      return updatedHotel;
    } catch (error) {
      throw new BadRequestException('Error updating hotel');
    }
  }

  async updateStatus(id: number, status: RegistrationStatus): Promise<Hotel> {
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

  async softDelete(id: number): Promise<void> {
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
