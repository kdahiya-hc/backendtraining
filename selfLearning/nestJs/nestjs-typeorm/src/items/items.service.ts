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
    @InjectRepository(Listing)
    private readonly listingRepository: Repository<Listing>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createItemDto: CreateItemDto) {
    const listing = this.listingRepository.create({
      ...createItemDto.listing,
      rating: 0,
    });

    const item = this.itemsRepository.create({
      ...createItemDto,
      listing,
      comment: [],
    });
    await this.itemsRepository.save(item);

    await this.entityManager.save(item);
    return item;
  }

  async findAll() {
    const items = this.itemsRepository.find({
      relations: { listing: true },
    });
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
