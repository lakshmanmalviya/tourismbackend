import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Param,
  Patch,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { HeritageService } from './heritage.service';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';
import { UpdateHeritageDto } from './dto/update-heritage.dto';

@Controller('heritages')
export class HeritageController {
  constructor(private readonly heritageService: HeritageService) {}

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

      const heritage = await this.heritageService.create(
        createHeritageDto,
        files,
      );
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
      const updatedHeritage = await this.heritageService.update(
        id,
        updateHeritageDto,
        files,
      );
      return {
        statusCode: 200,
        message: 'Heritage updated successfully with images',
        data: updatedHeritage,
      };
    } catch (error) {
      throw new BadRequestException('Error updating heritage');
    }
  }
}
