import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { CreateSongDTO } from './dto/create-song.dto';
import { ResponseSongDTO } from './dto/response-song.dto';
import { UpdateSongDTO } from './dto/update-song.dto';
import { plainToInstance } from 'class-transformer';
import { Song } from './entity/song.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

// Toggle between these 3 decorators to test each scope:
@Injectable() // Singleton (DEFAULT)
// @Injectable({ scope: Scope.REQUEST })   // Request
// @Injectable({ scope: Scope.TRANSIENT })    // Transient
export class SongService {
  constructor(
    @InjectRepository(Song)
    private songRepository: Repository<Song>,
  ) {}

  async create(createSongDto: CreateSongDTO): Promise<ResponseSongDTO> {
    const newSong = this.songRepository.create({
      ...createSongDto,
    });
    const saved = await this.songRepository.save(newSong);
    return plainToInstance(ResponseSongDTO, saved, {
      excludeExtraneousValues: true,
    });
  }

  async update(
    id: number,
    updateSongDto: UpdateSongDTO,
  ): Promise<ResponseSongDTO> {
    const updateData = { ...updateSongDto, id };
    const updateResult = await this.songRepository.update(id, updateData);

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }

    const updatedSong = await this.songRepository.findOneBy({ id });
    return plainToInstance(ResponseSongDTO, updatedSong, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: number): Promise<void> {
    const deleteResult = await this.songRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Song with ID ${id} not found`);
    }
  }

  async paginate(
    options: IPaginationOptions,
  ): Promise<Pagination<ResponseSongDTO>> {
    const paginated = await paginate<Song>(this.songRepository, options);

    const items = paginated.items.map((song) =>
      plainToInstance(ResponseSongDTO, song, {
        excludeExtraneousValues: true,
      }),
    );
    return new Pagination(items, paginated.meta, paginated.links);
  }

  async findAll(): Promise<ResponseSongDTO[]> {
    const songs = await this.songRepository.find();
    return plainToInstance(ResponseSongDTO, songs, {
      excludeExtraneousValues: true,
    });
  }

  async findOne(id: number): Promise<ResponseSongDTO> {
    const song = await this.songRepository.findOneBy({ id });
    if (!song) throw new NotFoundException(`Song with ID ${id} not found`);
    return plainToInstance(ResponseSongDTO, song, {
      excludeExtraneousValues: true,
    });
  }
}
