import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateListingDto {
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number = 0;
}
