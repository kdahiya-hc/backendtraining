import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateItemDto {
	@IsString()
	@IsNotEmpty()
	readonly name: string;
	@IsString()
	@IsNotEmpty()
	readonly description: string;
	@Type(() => Number)
	@IsNumber()
	readonly qty: number;
}