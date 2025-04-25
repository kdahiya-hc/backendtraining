import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateListingDto } from './create-listing.dto';
import { Type } from 'class-transformer';
import { CreateCommentDto } from './create-comment.dto';
import { CreateTagDto } from './create-tag.dto';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsBoolean()
  public: boolean;

  @ValidateNested()
  @Type(() => CreateListingDto)
  @IsDefined()
  listing: CreateListingDto;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateCommentDto)
  comment?: CreateCommentDto[] = [];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateTagDto)
  tag?: CreateTagDto[] = [];
}
