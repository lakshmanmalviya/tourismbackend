import {
  IsString,
  IsOptional,
  IsNumber,
  IsUrl,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { RegistrationStatus } from 'src/types/registrationStatus.enum';

export class CreateHotelDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsUrl()
  websiteLink?: string;

  @IsOptional()
  mapUrl: string;

  @IsInt()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value, 10))
  hotelStarRating: number;

  @IsString()
  address: string;

  @IsString()
  @IsOptional()
  contact: string;

  @IsInt()
  @Min(0)
  @Transform(({ value }) => parseInt(value, 10))
  availableRooms: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsString()
  placeId: string;

  @IsString()
  userId: string;

  @IsEnum(RegistrationStatus)
  @IsOptional()
  @Transform(
    ({ value }) => RegistrationStatus[value as keyof typeof RegistrationStatus],
  )
  registrationStatus?: RegistrationStatus;
}
