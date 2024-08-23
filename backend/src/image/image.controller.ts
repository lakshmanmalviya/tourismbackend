import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CreateImageDto } from './create-image.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() createImageDto: CreateImageDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      const image = await this.imageService.uploadImage(file, createImageDto);

      return {
        statusCode: 201,
        message: 'Image uploaded successfully',
        data: image,
      };
    } catch (error) {
      throw new BadRequestException('Error during image upload');
    }
  }
}
