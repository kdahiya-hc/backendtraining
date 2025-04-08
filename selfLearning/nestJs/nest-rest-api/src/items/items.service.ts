import { Injectable } from '@nestjs/common';
import { Item } from './interfaces/items.interfaces';

@Injectable()
export class ItemsService {
	private readonly items: Item[] = [
		{
			id: '1',
			name: 'Table',
			description: 'Something to place on',
			qty: 100
		},
		{
			id: '2',
			name: 'Chair',
			description: 'Something to sit on',
			qty: 100
		},
		{
			id: '3',
			name: 'Desk',
			description: 'Something to keep on',
			qty: 100
		},
	];

	findAll(): Item[] {
		return this.items;
	}
}
