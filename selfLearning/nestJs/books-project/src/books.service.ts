import { Injectable } from '@nestjs/common';
import { Book, books } from './fakeBookData';

@Injectable()
export class BooksService {
  getAllBooks(): Book[] {
    return books;
  }
}
