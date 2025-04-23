import { CreateSongDTO } from './dto/create-song.dto';
import { ResponseSongDTO } from './dto/response-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { SongService } from './song.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  Controller,
  Body,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';

@Controller('songs')
export class SongController {
  constructor(private readonly songService: SongService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<ResponseSongDTO>> {
    limit = Math.min(limit, 100);
    return this.songService.paginate({ page, limit });
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
    @Body() updateSongDto: UpdateSongDTO,
  ): Promise<ResponseSongDTO> {
    return this.songService.update(id, updateSongDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.songService.delete(id);
  }
}
