import {
  IsBoolean,
  IsDefined,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateListingDto } from './create-listing.dto';
import { Type } from 'class-transformer';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsBoolean()
  public: boolean;

  @ValidateNested()
  @Type(() => CreateListingDto)
  @IsDefined()
  listing: CreateListingDto;
}
