import { IsString, IsOptional, IsArray } from 'class-validator';

export class UpdateHeritageDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];
}
