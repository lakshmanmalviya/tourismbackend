import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateHeritageDto {
  @IsNotEmpty()
  @IsString()
  name:string;

  @IsNotEmpty()
  @IsString() 
  description: string;

  @IsNotEmpty()
  @IsNumber()
  placeId: number;
  
}
