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
  NotFoundException,
  Get,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { PlaceService } from './place.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('places')
export class PlaceController {
  constructor(private readonly placeService: PlaceService) {}

  @Get()
  async getAllPlacesWithImages(
    @Query() paginationDto: PaginationDto,
  ) {
    try {
      const placesWithImages = await this.placeService.getAllPlacesWithImages(paginationDto);
      return {
        statusCode: 200,
        message: 'All places fetched successfully',
        data: placesWithImages.data,
        meta: {
          totalPages: placesWithImages.totalPages,
          totalCount: placesWithImages.totalCount,
          currentPage: paginationDto.page,
          limit: paginationDto.limit,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error fetching places details');
    }
  }

  @Get(':id')
  async getPlaceWithImages(@Param('id') id: number) {
    try {
      const { place, images } = await this.placeService.getPlaceWithImages(id);
      return {
        statusCode: 200,
        message: 'Place fetched successfully',
        data: {
          place,
          images,
        },
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error fetching place details');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async updatePlace(
    @Param('id') id: number,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    try {
      const updatedPlace = await this.placeService.updatePlace(id, updatePlaceDto);
      return {
        statusCode: 200,
        message: 'Place updated successfully',
        data: updatedPlace,
      };
    } catch (error) {
      throw new BadRequestException('Error updating place');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async deletePlace(@Param('id') id: number) {
    try {
      await this.placeService.deletePlace(id);
      return {
        statusCode: 200,
        message: 'Place and associated images deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error deleting place');
    }
  }
}
