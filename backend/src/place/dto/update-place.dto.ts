import { IsOptional, IsString, IsNotEmpty } from 'class-validator';

export class UpdatePlaceDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
