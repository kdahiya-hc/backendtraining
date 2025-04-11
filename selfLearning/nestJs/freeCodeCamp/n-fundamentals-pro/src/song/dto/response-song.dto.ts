import { Expose } from 'class-transformer';

export class ResponseSongDTO {
  @Expose()
  id: number;

  @Expose()
  title: string;

  @Expose()
  artists: string[];

  @Expose()
  releasedDate: Date;

  @Expose()
  duration: string;
}