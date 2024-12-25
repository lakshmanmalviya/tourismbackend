import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { EntityType } from '../types/entityType.enum';

export class CreateImageDto {
  @IsEnum(EntityType)
  @IsNotEmpty()
  entityType: EntityType;

  @IsString()
  @IsNotEmpty()
  entityId: string;
}
