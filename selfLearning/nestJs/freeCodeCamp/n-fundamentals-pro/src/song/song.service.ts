import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateSongDTO } from "./dto/create-song.dto";
import { UpdateSongDTO } from "./dto/update-song.dto";

@Injectable()
export class SongService{
	private readonly songs: {
		id: number;
		title: string;
		artists: string[];
		releasedDate: Date;
		duration?: string;
	  }[] = [
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
	  ]
	findAll() {
		if (this.songs.length === 0) throw new NotFoundException();
		return this.songs;
	}

	findOne(id: number) {
		const song = this.songs.find((song) => song.id === id);
		if (!song) throw new NotFoundException();
		return song;
	}

	create(createSongDto: CreateSongDTO) {
		const newSong = {
			...createSongDto, id: this.songs.length + 1
		};
		this.songs.push(newSong);
		return newSong;
	}

	update(id: number, updateSongDto: UpdateSongDTO) {
		const existingSong = this.songs.find((song) => song.id === id);
		if (!existingSong) throw new NotFoundException();
		const updatedSong = {
			...existingSong, ...updateSongDto,  id: id,
		};
		const index = this.songs.findIndex((song) => song.id === id);
  		this.songs[index] = updatedSong;

		return updatedSong;
	}

	delete(id: number) {
		const index = this.songs.findIndex(song => song.id === id);
		if (index === -1) throw new NotFoundException();
		const deleteSong = this.songs.find((song) => song.id === id);
		this.songs.splice(index, 1);
		return deleteSong;
	}
}