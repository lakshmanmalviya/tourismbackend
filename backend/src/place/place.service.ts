import {
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Place } from './place.entity';
  import { CreatePlaceDto } from './dto/create-place.dto';
  import { ImageService } from '../image/image.service';
  import { EntityType } from 'src/types/entityType.enum';
  
  @Injectable()
  export class PlaceService {
    constructor(
      @InjectRepository(Place)
      private readonly placeRepository: Repository<Place>,
      private readonly imageService: ImageService,
    ) {}
  
    async createPlace(
      createPlaceDto: CreatePlaceDto,
      files: Express.Multer.File[],
    ): Promise<Place> {
      const place = this.placeRepository.create(createPlaceDto);
  
      try {
        const savedPlace = await this.placeRepository.save(place);
  
        if (files && files.length > 0) {
          const uploadPromises = files.map((file) => {
            const createImageDto = {
              entityType: EntityType.PLACE,
              entityId: savedPlace.id.toString(),
            };
            return this.imageService.uploadImage(file, createImageDto);
          });
  
          await Promise.all(uploadPromises);
        }
  
        return savedPlace;
      } catch (error) {
        throw new BadRequestException('Error creating place or uploading images');
      }
    }
  }
  