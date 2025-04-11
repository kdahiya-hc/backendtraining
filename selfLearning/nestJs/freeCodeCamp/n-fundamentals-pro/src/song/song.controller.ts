import { CreateSongDTO } from "./dto/create-song.dto";
import { ResponseSongDTO } from "./dto/response-song.dto";
import { UpdateSongDTO } from "./dto/update-song.dto";
import { SongService } from "./song.service";
import { Controller, UsePipes, ValidationPipe, Body, Get, Post, Patch, ParseIntPipe, Delete, Param } from "@nestjs/common";

@Controller('songs')
export class SongController {
	constructor (private readonly songService: SongService) {}

	@Get('service-info')
	getServiceInfo(): { instanceId: string } {
		return this.songService.getServiceInfo();
	}

	@Get()
	findAll(): ResponseSongDTO[] {
		return this.songService.findAll();
	}

	@Get('/:id')
	findOne(@Param('id', ParseIntPipe) id: number): ResponseSongDTO {
		return this.songService.findOne(id);
	}

	@Post()
	create(@Body() createSongDto: CreateSongDTO): ResponseSongDTO {
		return this.songService.create(createSongDto);
	}

	@Patch('/:id')
	update(@Param('id', ParseIntPipe) id: number, @Body() updateSongDto: UpdateSongDTO): ResponseSongDTO {
		return this.songService.update(id, updateSongDto);
	}

	@Delete('/:id')
	delete(@Param('id', ParseIntPipe) id: number): ResponseSongDTO {
		return this.songService.delete(id);
	}
}