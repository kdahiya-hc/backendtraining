import { CreateSongDTO } from "./dto/create-song.dto";
import { ResponseSongDTO } from "./dto/response-song.dto";
import { UpdateSongDTO } from "./dto/update-song.dto";
import { SongService } from "./song.service";
import { Song } from "./entity/song.entity";
import { Controller, Body, Get, Post, Patch, ParseIntPipe, Delete, Param } from "@nestjs/common";

@Controller('songs')
export class SongController {
	constructor (private readonly songService: SongService) {}

	@Get()
	findAll(): Promise<ResponseSongDTO[]> {
		return this.songService.findAll();
	}

	@Get('/:id')
	findOne(@Param('id', ParseIntPipe) id: number): Promise<ResponseSongDTO> {
		return this.songService.findOne(id);
	}

	@Post()
	create(@Body() createSongDto: CreateSongDTO): Promise<ResponseSongDTO> {
		return this.songService.create(createSongDto);
	}

	@Patch('/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateSongDto: UpdateSongDTO
    ): Promise<ResponseSongDTO> {
        return this.songService.update(id, updateSongDto);
    }

    @Delete('/:id')
    delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.songService.delete(id);
    }
}