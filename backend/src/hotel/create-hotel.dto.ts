import { IsNotEmpty, IsString, IsNumber, IsUrl, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { RegistrationStatus } from './hotel.entity';

export class CreateHotelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsUrl()
  websiteLink: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  hotelStarRating: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  availableRooms: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsEnum(RegistrationStatus)
  registrationStatus?: RegistrationStatus;

  @IsNumber()
  placeId: number;

  @IsNumber()
  userId: number;
}
