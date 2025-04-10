import { IsString, IsNotEmpty, IsDateString, IsArray, IsPositive, IsInt } from 'class-validator';

export class CreateSongDTO {
	@IsString()
	@IsNotEmpty()
	readonly title: string;

	@IsArray()
	@IsString({ each: true })
	@IsNotEmpty()
	readonly artists: string[];

	@IsDateString()
	@IsNotEmpty()
	readonly releasedDate: Date;

	@IsNotEmpty()
	@IsString()
	readonly duration?: string;
  }