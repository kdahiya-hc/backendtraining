import { Injectable } from "@nestjs/common";

@Injectable()
export class SongService{
	findAll(): string {
		return 'find all song endpoint'
	}

	findOne(): string {
		return 'find one song endpoint'
	}

	create(): string {
		return 'create all song endpoint'
	}

	update(): string {
		return 'update all song endpoint'
	}

	delete(): string {
		return 'delete all song endpoint'
	}
}