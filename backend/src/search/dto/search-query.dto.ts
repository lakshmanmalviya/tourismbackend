import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { EntityType } from 'src/types/entityType.enum';

export class SearchQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsEnum(EntityType)
  entityType: EntityType;

  @IsOptional()
  @IsNumber()
  hotelStarRating?: number;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsString()
  placeId?: string;

  @IsOptional()
  tagIds?: number[];

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  sortBy?: 'price' | 'hotelStarRating' | 'name';

  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC';
}
