import { PartialType } from '@nestjs/mapped-types';
import { BaseSongDTO } from './base-song.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateSongDTO extends PartialType(BaseSongDTO) {
  @IsNotEmpty()
  id: number;
}