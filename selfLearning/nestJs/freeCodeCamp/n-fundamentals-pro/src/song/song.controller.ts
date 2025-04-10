import { CreateSongDto } from "./dto/create-song.dto";
import { SongService } from "./song.service";
import { Controller, Body, Get, Post, Patch, Delete } from "@nestjs/common";

@Controller('songs')
export class SongController {
	constructor (private readonly songService: SongService) {}

	@Get()
	findAll(): string {
		return this.songService.findAll();
	}

	@Get()
	findOne(): string {
		return this.songService.findOne();
	}

	@Post()
	create(@Body() createSong : CreateSongDto): any {
		return this.songService.create();
	}

	@Patch()
	update(): string {
		return this.songService.update();
	}

	@Delete()
	delete(): string {
		return this.songService.delete();
	}
}