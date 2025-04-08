import { Controller, Param, Body, Get, Put, Delete, Post, Req, Res } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';
import { Item } from './interfaces/items.interfaces';

@Controller('items')
export class ItemsController {
	// dependency being injected
	constructor( private readonly itemsService: ItemsService) {}

	@Get()
	async findAll(): Promise<Item[]> {
		return await this.itemsService.findAll();
	}

	@Get('/:id')
	async findOne(@Param('id') id: string): Promise<Item | null> {
		return await this.itemsService.findOne(id);
	}

	@Post()
	create(@Body() createItemDto: CreateItemDto): string {
	return `Name: ${createItemDto.name}\nDescription: ${createItemDto.description}`
	}

	@Delete('/:id')
	deleteOne(@Param('id') id: string): string {
		return `Delete ${id}`;
	}

	@Put('/:id')
	updateOne(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto): string {
		return `Update ${id} - Name: ${updateItemDto.name}`;
	}
}
