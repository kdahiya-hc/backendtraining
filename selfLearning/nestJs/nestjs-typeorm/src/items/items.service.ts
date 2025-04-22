import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { EntityManager, Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const listing = new Listing({
      ...createItemDto.listing,
      rating: 0,
    });
    const item = new Item({ ...createItemDto, listing });
    await this.entityManager.save(item);
    return item;
  }

  async findAll() {
    const items = this.itemsRepository.find();
    return items;
  }

  async findOne(id: number) {
    const item = await this.itemsRepository.findOne({
      where: { id },
      relations: { listing: true },
    });
    return item;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    const item = await this.itemsRepository.findOneBy({ id });
    if (!item) return false;
    item.public = updateItemDto.public;
    await this.entityManager.save(item);
    return item;
  }

  async remove(id: number) {
    const item = await this.itemsRepository.delete(id);
    if (!item.affected) return false;
    return true;
  }
}
