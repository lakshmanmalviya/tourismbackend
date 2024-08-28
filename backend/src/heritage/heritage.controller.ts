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
  async findAll() {
    try {
      const heritages = await this.heritageService.findAll();
      return {
        statusCode: 200,
        message: 'All heritages fetched successfully',
        data: heritages,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages');
    }
  }

  @Get('tag/:tagId')
  async findByTag(@Param('tagId') tagId: number) {
    try {
      const heritages = await this.heritageService.findByTag(tagId);
      return {
        statusCode: 200,
        message: 'Heritages fetched successfully',
        data: heritages,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching heritages by tag');
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
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error fetching heritage details');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async create(
    @Body() createHeritageDto: CreateHeritageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      if (!files || files.length === 0) {
        throw new BadRequestException('At least one file is required');
      }

      const heritage = await this.heritageService.create(createHeritageDto, files);
      return {
        statusCode: 201,
        message: 'Heritage created successfully with images',
        data: heritage,
      };
    } catch (error) {
      throw new BadRequestException('Error creating heritage');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('files'))
  async update(
    @Param('id') id: number,
    @Body() updateHeritageDto: UpdateHeritageDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      const updatedHeritage = await this.heritageService.update(id, updateHeritageDto, files);
      return {
        statusCode: 200,
        message: 'Heritage updated successfully with images',
        data: updatedHeritage,
      };
    } catch (error) {
      throw new BadRequestException('Error updating heritage');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.heritageService.remove(id);
      return {
        statusCode: 200,
        message: 'Heritage and associated images deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new BadRequestException('Error deleting heritage');
    }
  }
}
