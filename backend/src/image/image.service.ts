import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './image.entity';
import { CreateImageDto } from './create-image.dto';
import * as streamifier from 'streamifier';
import cloudinary from '../config/cloudinary.config';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async uploadImage(file: Express.Multer.File, createImageDto: CreateImageDto){
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `tourism/${createImageDto.entityType}/${createImageDto.entityId}`,
        },
        (error, result) => {
          if (error) {
            throw error;
          }
  
          const image = this.imageRepository.create({
            publicID: result.public_id,
            entityType: createImageDto.entityType,
            entityId: createImageDto.entityId,
            imageLink: result.secure_url,
          });

          return this.imageRepository.save(image);
        },
      );
  
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    } catch (error) {
      throw error;
    }
  }
  
}
