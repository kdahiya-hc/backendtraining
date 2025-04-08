import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './interfaces/items.interfaces';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ItemsService {
	constructor(@InjectModel('Item') private readonly itemModel: Model<Item>) {}

	async findAll(): Promise<Item[]> {
		return await this.itemModel.find();
	}

	async findOne(id: string): Promise<Item | null> {
		const item = await this.itemModel.findOne({ _id: id });
		if (!item) {
			throw new NotFoundException(`Item with ID ${id} not found`);
		  }

		return item;
	}
}
