import {
    Injectable,
    BadRequestException,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { Place } from './place.entity';
  import { CreatePlaceDto } from './dto/create-place.dto';
  import { UpdatePlaceDto } from './dto/update-place.dto'; 
  import { ImageService } from '../image/image.service';
  import { EntityType } from 'src/types/entityType.enum';
import { Image } from 'src/image/image.entity';
  
  @Injectable()
  export class PlaceService {
    constructor(
      @InjectRepository(Place)
      private readonly placeRepository: Repository<Place>,
      private readonly imageService: ImageService,
    ) {}

    async getPlaceById(id: number) : Promise<Place> {
      return await this.placeRepository.findOne({where: {id}})
    }
    async getPlaceWithImages(id: number): Promise<{ place: Place; images:Image[] }> {
      const place = await this.placeRepository.findOne({ where: { id } });
  
      if (!place) {
        throw new NotFoundException(`Place with ID ${id} not found`);
      }
  
      const images = await this.imageService.getImagesByEntity(id.toString());
      return { place, images };
    }

    async getAllPlacesWithImages(): Promise<{ place: Place; images: Image[] }[]> {
      const places = await this.placeRepository.find();
  
      const placesWithImages = await Promise.all(
        places.map(async (place) => {
          const images = await this.imageService.getImagesByEntity(place.id.toString());
          return { place, images };
        }),
      );
  
      return placesWithImages;
    }
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
  
    async updatePlace(id: number, updatePlaceDto: UpdatePlaceDto): Promise<Place> {
      const place = await this.placeRepository.findOne({where: {id}});
  
      if (!place) {
        throw new NotFoundException('Place not found');
      }
  
      Object.assign(place, updatePlaceDto);
  
      try {
        return await this.placeRepository.save(place);
      } catch (error) {
        throw new BadRequestException('Error updating place');
      }
    }
  
  async deletePlace(id: number): Promise<void> {
    const place = await this.placeRepository.findOne({ where: { id } });
  
    if (!place) {
      throw new NotFoundException(`Place with ID ${id} not found`);
    }
  
    try {
      await this.imageService.deleteImagesByEntity(id.toString());
      await this.placeRepository.delete(id);
    } catch (error) {
      throw new BadRequestException(
        'Error deleting place or associated images',
      );
    }
  }
  }
  