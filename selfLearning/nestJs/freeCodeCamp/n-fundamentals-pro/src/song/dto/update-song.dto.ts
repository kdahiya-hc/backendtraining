import { PartialType } from '@nestjs/mapped-types';
import { BaseSongDTO } from './base-song.dto';

export class UpdateSongDTO extends PartialType(BaseSongDTO) {
}