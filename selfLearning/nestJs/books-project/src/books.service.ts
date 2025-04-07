import { Injectable } from '@nestjs/common';
import { Book, books } from './fakeBookData';

@Injectable()
export class BooksService {
  getAllBooks(): Book[] {
    return books;
  }

  findById(bookID): Book | undefined{
    const book = books.find(book => book.id === bookID);
    return book;
  }
}
