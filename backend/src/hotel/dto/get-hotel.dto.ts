import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';

export class GetHotelDto extends PartialType(PaginationDto) {

    @IsOptional()
    ownerId: string;
}
