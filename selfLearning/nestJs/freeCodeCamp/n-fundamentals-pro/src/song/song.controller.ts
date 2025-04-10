import { CreateSongDTO } from "./dto/create-song.dto";
import { UpdateSongDTO } from "./dto/update-song.dto";
import { SongService } from "./song.service";
import { Controller, Body, Get, Post, Patch, ParseIntPipe, Delete, HttpStatus, Param } from "@nestjs/common";

@Controller('songs')
export class SongController {
	constructor (private readonly songService: SongService) {}

	@Get()
	findAll(){
		return this.songService.findAll();
	}

	@Get('/:id')
	findOne(@Param('id', ParseIntPipe) id: number) {
		return this.songService.findOne(id);
	}

	@Post()
	create(@Body() createSongDto: CreateSongDTO) {
		return this.songService.create(createSongDto);
	}

	@Patch('/:id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDTO) {
		return this.songService.update(id, updateSongDto);
	}

	@Delete('/:id')
	delete(@Param('id', ParseIntPipe) id: number) {
		return this.songService.delete(id);
	}
}