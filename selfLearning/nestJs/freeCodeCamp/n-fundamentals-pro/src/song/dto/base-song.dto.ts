import { IsString, IsNotEmpty, IsDateString, IsArray } from 'class-validator';

export class BaseSongDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty()
  artists: string[];

  @IsDateString()
  @IsNotEmpty()
  releasedDate: Date;

  @IsString()
  duration: string;
}