import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Patch,
  Param,
  Delete,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { HeritageService } from './heritage.service';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { UpdateHeritageDto } from './dto/update-heritage.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('heritages')
export class HeritageController {
  constructor(private readonly heritageService: HeritageService) {}

  @Get()
  async findAll(@Query() query: PaginationDto) {
    const { page = 1, limit = 5 } = query;
    const { data, totalCount, totalPages } =
      await this.heritageService.findAll(query);
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
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const heritage = await this.heritageService.findOne(id);
    return {
      statusCode: 200,
      message: 'Heritage fetched successfully',
      data: heritage,
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
  async create(
    @Body() createHeritageDto: CreateHeritageDto,
    @UploadedFiles()
    files: { images?: Express.Multer.File[]; thumbnail: Express.Multer.File[] },
  ) {
    if (!files.thumbnail) {
      throw new BadRequestException('Thumbnail is required');
    }

    const heritage = await this.heritageService.createHeritage(
      createHeritageDto,
      files,
    );
    return {
      statusCode: 201,
      message: 'Heritage created successfully',
      data: heritage,
    };
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @UseInterceptors(FilesInterceptor('thumbnail'))
  async update(
    @Param('id') id: string,
    @Body() updateHeritageDto: UpdateHeritageDto,
    @UploadedFiles() thumbnail?: Express.Multer.File[],
  ) {
    const heritage = await this.heritageService.update(
      id,
      updateHeritageDto,
      thumbnail,
    );
    return {
      statusCode: 200,
      message: 'Heritage updated successfully',
      data: heritage,
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  async remove(@Param('id') id: string) {
    await this.heritageService.remove(id);
    return {
      statusCode: 200,
      message: 'Heritage deleted successfully',
    };
  }
}
