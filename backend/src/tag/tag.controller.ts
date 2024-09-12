import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './create-tag.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from 'src/role/role.guard';
import { Roles } from 'src/role/roles.decorator';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Post()
  async create(@Body() createTagDto: CreateTagDto) {
    try {
      console.log("here .....", createTagDto)
      const tag = await this.tagService.create(createTagDto);
      return {
        statusCode: 201,
        message: 'Tag created successfully',
        data: tag,
      };
    } catch (error) {
      throw new BadRequestException('Error creating Tag');
    }
  }

  @Get()
  async findAll() {
    try {
      const tags = await this.tagService.findAll();
      return {
        statusCode: 200,
        message: 'Tags fetched successfully',
        data: tags,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching tags');
    }
  }

  @Get(':id')
  async findByIds(@Param('id') id: string) {
    try {
      const tag = await this.tagService.findById(id);

      return {
        statusCode: 200,
        message: 'Tag fetched successfully',
        data: tag,
      };
    } catch (error) {
      throw new BadRequestException('Error fetching place details');
    }
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(['ADMIN'])
  @Delete(':id')
  async remove(@Param('id') id: number) {
    try {
      await this.tagService.remove(id);
      return {
        statusCode: 200,
        message: 'Tag deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException('Error deleting tag');
    }
  }
}
