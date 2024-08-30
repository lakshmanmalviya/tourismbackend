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
import { RegistrationStatus } from 'src/types/registrationStatus.enum';

@Controller('hotels')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Get()
  async findAll(
    @Query('ownerId') ownerId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const hotels = await this.hotelService.findAll(ownerId,{ page, limit});
      return {
        statusCode: 200,
        message: 'Hotels fetched successfully',
        data: hotels.data,
        total: hotels.total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching hotels', error.message);
    }
  }

  @Get('pending')
  async findPending(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const hotels = await this.hotelService.findPending({page, limit});
      return {
        statusCode: 200,
        message: 'Pending hotels fetched successfully',
        data: hotels.data,
        total: hotels.total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching pending hotels');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const hotel = await this.hotelService.findOne(id);
      return {
        statusCode: 200,
        message: 'Hotel fetched successfully',
        data: hotel,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching hotel');
    }
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
  @Roles(['ADMIN'])
  @Patch('status/:hotelId')
  async updateStatus(
    @Param('hotelId') hotelId: number,
    @Body('status') status: RegistrationStatus,
  ) {
    try {
      const updatedHotel = await this.hotelService.updateStatus(
        hotelId,
        status,
      );
      return {
        statusCode: 200,
        message: 'Hotel status updated successfully',
        data: updatedHotel,
      };
    } catch (error) {
      throw new BadRequestException('Error updating hotel status');
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
