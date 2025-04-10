import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';

@Module({
	imports: [],
	controllers: [SongController],
	providers: [
		{ provide: SongService, useClass: SongService }
	],
})
export class SongModule {}