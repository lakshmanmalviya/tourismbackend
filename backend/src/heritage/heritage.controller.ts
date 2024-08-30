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
import { HeritageService } from './heritage.service';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { UpdateHeritageDto } from './dto/update-heritage.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';

@Controller('heritages')
export class HeritageController {
  constructor(private readonly heritageService: HeritageService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const { data, totalCount, totalPages } = await this.heritageService.findAll(page, limit);
      return {
        statusCode: 200,
        message: 'All heritages fetched successfully',
        data,
        meta: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages');
    }
  }

  @Get('tag/:tagId')
  async findByTag(
    @Param('tagId') tagId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const { data, totalCount, totalPages } = await this.heritageService.findByTag(tagId, page, limit);
      return {
        statusCode: 200,
        message: 'Heritages fetched successfully',
        data,
        meta: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages by tag');
    }
  }

  @Get('place/:placeId')
  async findByPlaceId(
    @Param('placeId') placeId: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    try {
      const { data, totalCount, totalPages } = await this.heritageService.findByPlaceId(placeId, page, limit);
      return {
        statusCode: 200,
        message: 'Heritages fetched successfully',
        data,
        meta: {
          totalCount,
          totalPages,
          currentPage: page,
          limit,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages by place ID');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    try {
      const heritage = await this.heritageService.findOne(id);
      return {
        statusCode: 200,
        message: 'Heritage fetched successfully',
        data: heritage,
      };
    } catch (error) {
      throw new NotFoundException(`Heritage with ID ${id} not found`);
    }
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createHeritageDto: CreateHeritageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const heritage = await this.heritageService.create(createHeritageDto, files);
      return {
        statusCode: 201,
        message: 'Heritage created successfully',
        data: heritage,
      };
    } catch (error) {
      throw new BadRequestException('Error creating heritage');
    }
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: number,
    @Body() updateHeritageDto: UpdateHeritageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const heritage = await this.heritageService.update(id, updateHeritageDto, files);
      return {
        statusCode: 200,
        message: 'Heritage updated successfully',
        data: heritage,
      };
    } catch (error) {
      throw new BadRequestException('Error updating heritage');
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async remove(@Param('id') id: number) {
    try {
      await this.heritageService.remove(id);
      return {
        statusCode: 200,
        message: 'Heritage deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error deleting heritage');
    }
  }
}
