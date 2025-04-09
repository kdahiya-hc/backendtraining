import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateItemDto {
	@Type(() => Number)
	@IsNumber()
	qty: number;
}
