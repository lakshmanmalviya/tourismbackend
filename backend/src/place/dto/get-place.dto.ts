import { IsBoolean, isBoolean, IsNumber, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";

export class GetPlaceDto extends PaginationDto {
    @IsOptional()
    @IsNumber()
    name: number = 0;
}