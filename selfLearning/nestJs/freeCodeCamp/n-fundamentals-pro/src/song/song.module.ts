import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './entity/song.entity';

// const mockingSongService = {
//   findAll() {
//     return 'find all song endpoint';
//   },

//   findOne(id) {
//     return `find one song endpoint ${id}`;
//   },

//   create(createSongData) {
//     return `create a song endpoint ${JSON.stringify(createSongData)}`;
//   },

//   update(updateSongData) {
//     return `update a song endpoint ${JSON.stringify(updateSongData)}`;
//   },

//   delete(id) {
//     return `delete a song endpoint ${id}`;
//   },
// };

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  controllers: [SongController],
  providers: [SongService],
  // providers: [{ provide: SongService, useClass: SongService }],
  // providers: [
  // 	{ provide: SongService, useValue: mockingSongService }
  // ]
})
export class SongModule {}
