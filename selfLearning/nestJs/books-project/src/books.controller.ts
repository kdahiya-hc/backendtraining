import { Body, Controller, Get, Param, Post, Delete } from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from './fakeBookData';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  getAllBooks(): Book[] | undefined{
    return this.booksService.getAllBooks();
  }

  @Get('/:id')
  getBookById(@Param('id') id: string): Book | string {
    return this.booksService.findById(+id);
  }

  @Post()
  addBook(@Body() book: Partial<Book>): Book | undefined{
    return this.booksService.createBook(book);
  }

  @Post('/:id')
  updateBook(@Body() book: Partial<Book>, @Param('id') id: string): Book | undefined{
    return this.booksService.updateBook(+id, book);
  }

  @Delete('/:id')
  removeBook(@Param('id') id: string): Book | undefined {
    return this.booksService.deleteBook(+id);
  }
}
