import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { EntityType } from './image.entity';

export class CreateImageDto {
  @IsNotEmpty()
  @IsString()
  publicID: string;

  @IsNotEmpty()
  @IsEnum(EntityType)
  entityType: EntityType;

  @IsNotEmpty()
  @IsNumber()
  entityId: number;

  @IsNotEmpty()
  @IsString()
  imageLink: string;
}
