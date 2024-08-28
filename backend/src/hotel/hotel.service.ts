import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  ForbiddenException,
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
@Injectable()
export class HotelService {
  private readonly logger = new Logger(HotelService.name);

  constructor(
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    private readonly imageService: ImageService,
    private readonly placeService: PlaceService,
    private readonly userService: UserService,
  ) {}

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
      this.logger.error(
        'Error creating hotel or uploading images',
        error.stack,
      );
      throw new BadRequestException('Error creating hotel or uploading images');
    }
  }
}
