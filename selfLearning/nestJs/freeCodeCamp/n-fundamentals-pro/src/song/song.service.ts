import { Injectable, NotFoundException, Scope } from "@nestjs/common";
import { CreateSongDTO } from "./dto/create-song.dto";
import { ResponseSongDTO } from "./dto/response-song.dto";
import { UpdateSongDTO } from "./dto/update-song.dto";
import { Song } from "./entity/song.entity";
// Toggle between these 3 decorators to test each scope:
@Injectable()                           // Singleton (DEFAULT)
// @Injectable({ scope: Scope.REQUEST })   // Request
// @Injectable({ scope: Scope.TRANSIENT })    // Transient
export class SongService{
	private instanceId = Math.random().toString(36).substring(2, 8);

	private toResponseDTO(song: Song): ResponseSongDTO {
		return {
		  ...song,
		  serviceInstanceId: this.instanceId,
		};
	  }

	private readonly songs: Song[] = [
		{
			id: 1,
			title: 'Run Away',
			artists: ['Tzuyu', 'Nayeon'],
			releasedDate: new Date('2024-12-12'),
			duration: '02:34'
		},
		{
			id: 2,
			title: 'Dont Run Away',
			artists: ['Momo', 'Tzuyu'],
			releasedDate: new Date('2024-12-24'),
			duration: '04:21'
		},
	  ];

	getServiceInfo(): { instanceId: string } {
		return {
			instanceId: this.instanceId,
		};
	}

	findAll(): ResponseSongDTO[] {
		return this.songs.map(song => this.toResponseDTO(song));
  	}

	findOne(id: number): ResponseSongDTO {
		const song = this.songs.find((song) => song.id === id);
		if (!song) throw new NotFoundException();
		return this.toResponseDTO(song);
	}

	create(createSongDto: CreateSongDTO): ResponseSongDTO {
		const newSong = {
			id: this.songs.length + 1,
			...createSongDto,
		};
		this.songs.push(newSong);
		return this.toResponseDTO(newSong);
	}

	update(id: number, updateSongDto: UpdateSongDTO): ResponseSongDTO {
		const existingSong = this.songs.find((song) => song.id === id);
		if (!existingSong) throw new NotFoundException();
		const updatedSong = {
			...existingSong, ...updateSongDto,  id: id,
		};
		const index = this.songs.findIndex((song) => song.id === id);
  		this.songs[index] = updatedSong;

		return this.toResponseDTO(updatedSong);
	}

	delete(id: number): ResponseSongDTO {
		const index = this.songs.findIndex(song => song.id === id);
		if (index === -1) throw new NotFoundException();
		const [deleteSong] = this.songs.splice(index, 1); // as splice returns the array of removed
		return this.toResponseDTO(deleteSong);
	}
}