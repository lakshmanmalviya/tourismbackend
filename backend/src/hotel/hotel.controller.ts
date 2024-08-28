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
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN', 'PROVIDER'])
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createHotelDto: Record<string, any>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('At least one file is required');
      }

      const transformedDto = plainToInstance(CreateHotelDto, createHotelDto);

      await validateOrReject(transformedDto);

      const hotel = await this.hotelService.create(transformedDto, files);
      return {
        statusCode: 201,
        message: 'Hotel created successfully with images',
        data: hotel,
      };
    } catch (error) {
      throw new BadRequestException('Error creating hotel');
    }
  }
}
