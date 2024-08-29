import { IsOptional, IsString, IsEnum, IsNumber, IsArray } from 'class-validator';
import { EntityType } from 'src/types/entityType.enum';

export class SearchQueryDto {
  @IsString()
  @IsOptional()
  keyword: string;

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
  @IsNumber()
  placeId: number;

  @IsOptional()
  @IsArray()
  tagIds: [number];
}
