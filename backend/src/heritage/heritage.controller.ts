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
import { HeritageService } from './heritage.service';
import { CreateHeritageDto } from './dto/create-heritage.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../role/role.guard';
import { Roles } from '../role/roles.decorator';

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


}
