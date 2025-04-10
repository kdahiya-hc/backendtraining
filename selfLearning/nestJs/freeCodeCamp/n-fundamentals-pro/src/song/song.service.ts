import { Injectable } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";
@Injectable()
export class SongService{
	findAll(): string {
		throw new HttpException('Error finding songs', HttpStatus.INTERNAL_SERVER_ERROR);
		return 'find all song endpoint';
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