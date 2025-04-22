import { IsNumber, IsString, Max } from 'class-validator';

export class CreateListingDto {
  @IsString()
  description: string;

  @IsNumber()
  @Max(5)
  rating: number;
}
