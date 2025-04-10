import { Injectable } from "@nestjs/common";
import { HttpException, HttpStatus } from "@nestjs/common";
@Injectable()
export class SongService{
	findAll(): string {
		try {
			throw new Error('Something happened');
			// return 'find all song endpoint';
		} catch (error) {
			throw new HttpException(
				'custom message',
				HttpStatus.INTERNAL_SERVER_ERROR,
				{
					cause: error,
				}
			);
		}
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