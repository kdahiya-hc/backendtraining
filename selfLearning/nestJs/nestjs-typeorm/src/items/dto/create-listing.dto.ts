import { IsNumber, IsOptional, IsString, Max } from 'class-validator';

export class CreateListingDto {
  @IsString()
  description: string;

  @IsNumber()
  @IsOptional()
  @Max(5)
  rating?: number;
}
