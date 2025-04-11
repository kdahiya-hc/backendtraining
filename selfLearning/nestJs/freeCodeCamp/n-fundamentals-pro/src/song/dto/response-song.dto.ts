import { BaseSongDTO } from './base-song.dto';

export class ResponseSongDTO extends BaseSongDTO {
  id: number;
  serviceInstanceId?: string;
}