import { Controller, Param, Body, Get, Put, Delete, Post, Req, Res } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Request, Response } from 'express';

@Controller('items')
export class ItemsController {
	@Get()
	findAll(@Req() req: Request, @Res() res: Response): Response {
		console.log(req.url);
		return res.json({'message': 'This is a message'});
	}

	@Get('/:id')
	findOne(@Param('id') id: string): string {
		return `Item ${id}`;
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
