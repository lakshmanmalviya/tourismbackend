import { IsOptional, IsString, IsEnum, IsNumber } from 'class-validator';
import { EntityType } from 'src/types/entityType.enum';

export class SearchQueryDto {
  @IsString()
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
}
