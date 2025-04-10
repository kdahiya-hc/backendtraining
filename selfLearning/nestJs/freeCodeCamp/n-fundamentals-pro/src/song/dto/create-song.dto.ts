import { IsString, IsNotEmpty, IsDateString, IsOptional, IsArray, IsMilitaryTime } from 'class-validator';

export class CreateSongDto {
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

	@IsMilitaryTime()
	@IsNotEmpty()
	@IsOptional()
	readonly duration?: Date;
  }