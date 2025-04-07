import { Controller, Get } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './fakeBookData';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(): Book[] {
    return this.booksService.getAllBooks();
  }
}
