import {
  IsArray,
  IsBoolean,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCommentDto } from './create-comment.dto';
import { CreateTagDto } from './create-tag.dto';

export class UpdateItemDto {
  @IsOptional()
  @IsBoolean()
  public?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateCommentDto)
  comment?: CreateCommentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => CreateTagDto)
  tag?: CreateTagDto[];
}
