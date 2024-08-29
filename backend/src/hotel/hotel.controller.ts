import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Patch,
  Param,
  Delete,
  Req,
  Get,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';
import { UpdateHotelDto } from './dto/update-hotel.dto';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async findAll(@Query('ownerId') ownerId: number) {
    try {
      const hotels = await this.hotelService.findAll(ownerId);
      return {
        statusCode: 200,
        message: 'Hotels fetched successfully',
        data: hotels,
      };
    } catch (error) {
      throw new BadRequestException(' Error fetching hotels', error.message);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const hotel = await this.hotelService.findOne(id);
    return {
      statusCode: 200,
      message: 'Hotel fetched successfully',
      data: hotel,
    };
  }

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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN', 'PROVIDER'])
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: number,
    @Body() updateHotelDto: Record<string, any>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const transformedDto = plainToInstance(UpdateHotelDto, updateHotelDto);
      await validateOrReject(transformedDto);

      const updatedHotel = await this.hotelService.update(
        id,
        transformedDto,
        files,
      );
      return {
        statusCode: 200,
        message: 'Hotel updated successfully with images',
        data: updatedHotel,
      };
    } catch (error) {
      throw new BadRequestException('Error updating hotel');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN', 'PROVIDER'])
  @Delete(':id')
  async softDelete(@Param('id') id: number) {
    try {
      await this.hotelService.softDelete(id);
      return {
        statusCode: 200,
        message: 'Hotel deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error deleting hotel');
    }
  }
}
