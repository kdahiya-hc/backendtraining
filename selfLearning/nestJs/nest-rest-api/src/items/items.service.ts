import { Injectable, NotFoundException } from '@nestjs/common';
import { Item } from './interfaces/items.interfaces'; // used in promise
import { Model } from 'mongoose'; // Used to fetch the model
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

	async create(item: Item): Promise<Item> {
		const newItem = new this.itemModel(item);
		return await newItem.save();
	}

	async update(id: string, item: Partial<Item>): Promise<Item> {
		const updatedItem = await this.itemModel.findByIdAndUpdate(
			id,
			item,
			{ new: true }
		);

		if (!updatedItem) {
			throw new NotFoundException(`Item with ID ${id} not found`);
		}

		return updatedItem;
	}
}
