import {
    Controller,
    Post,
    Body,
    UploadedFiles,
    UseInterceptors,
    UseGuards,
    BadRequestException,
  } from '@nestjs/common';
  import { FilesInterceptor } from '@nestjs/platform-express';
  import { PlaceService } from './place.service';
  import { CreatePlaceDto } from './dto/create-place.dto';
  import { AuthGuard } from '../auth/auth.guard';
  
  @Controller('places')
  export class PlaceController {
  
    constructor(private readonly placeService: PlaceService) {}
  
    @UseGuards(AuthGuard)
    @Post()
    @UseInterceptors(FilesInterceptor('files')) 
    async createPlace(
      @Body() createPlaceDto: CreatePlaceDto,
      @UploadedFiles() files: Express.Multer.File[],
    ) {
      try {
        if (!files || files.length === 0) {
          throw new BadRequestException('At least one file is required');
        }
  
        const place = await this.placeService.createPlace(createPlaceDto, files);
        return {
          statusCode: 201,
          message: 'Place created successfully with images',
          data: place,
        };
      } catch (error) {
        throw new BadRequestException('Error creating place');
      }
    }
  }
  