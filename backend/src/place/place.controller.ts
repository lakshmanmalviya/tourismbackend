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
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
  async getAllPlaces(@Query() paginationDto: PaginationDto) {
    const placesWithImages = await this.placeService.findAll(paginationDto);
    return {
      statusCode: 200,
      message: 'All places fetched successfully',
      data: placesWithImages,
      meta: {
        totalPages: placesWithImages.totalPages,
        totalCount: placesWithImages.totalCount,
        currentPage: paginationDto.page,
        limit: paginationDto.limit,
      },
    };
  }

  @Get(':id')
  async getPlaceById(@Param('id') id: string) {
    const place = await this.placeService.findById(id);
    return {
      statusCode: 200,
      message: 'Place fetched successfully',
      data: {
        place,
      },
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'images' },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async createPlace(
    @Body() createPlaceDto: CreatePlaceDto,
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ) {
    if (!files.thumbnail) {
      throw new BadRequestException('Thumbnail is required');
    }

    const place = await this.placeService.createPlace(createPlaceDto, files);
    return {
      statusCode: 201,
      message: 'Place created successfully with images',
      data: place,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  async updatePlace(
    @Param('id') id: string,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    const updatedPlace = await this.placeService.updatePlace(
      id,
      updatePlaceDto,
    );
    return {
      statusCode: 200,
      message: 'Place updated successfully',
      data: updatedPlace,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async deletePlace(@Param('id') id: string) {
    await this.placeService.deletePlace(id);
    return {
      statusCode: 200,
      message: 'Place and associated images deleted successfully',
    };
  }
}
