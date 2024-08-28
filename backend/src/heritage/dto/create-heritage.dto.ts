import { IsString, IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateHeritageDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  tagIds: string;
  
  @IsString()
  placeId: string;
}
