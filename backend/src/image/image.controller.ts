import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  UseGuards,
  Delete,
  Param,
  NotFoundException,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image.service';
import { CreateImageDto } from './create-image.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  
  // @Get(':entityId')
  // async getImagesByEntity(@Param('entityId') entityId: string) {
  //   try {
  //     const images = await this.imageService.getImagesByEntity(entityId);
  //     return {
  //       statusCode: 200,
  //       message: 'Images retrieved successfully',
  //       data: images,
  //     };
  //   } catch(error) {
  //     throw new NotFoundException(error.message);
  //   }
    
  // }
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

  @UseGuards(AuthGuard)
  @Delete(':publicID')
  async deleteImage(@Param('publicID') publicID: string) {
    try {
      await this.imageService.deleteImage(publicID);

      return {
        statusCode: 200,
        message: 'Image deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error during image deletion');
    }
  }
}
