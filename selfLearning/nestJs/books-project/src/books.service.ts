import { Injectable } from '@nestjs/common';
import { Book, books } from './fakeBookData';
import { title } from 'process';

@Injectable()
export class BooksService {
  getAllBooks(): Book[] | undefined{
    return books;
  }

  findById(bookID: number): Book | string{
    const book = books.find(book => book.id === bookID);
    if (!book) return "No Book found!"
    return book;
  }

  createBook(bookData: Partial<Book> ): Book | undefined{
    const newID = books[books.length-1].id + 1;
    const newBook = {
      id: newID,
      title: bookData.title ?? "No title",
      author: bookData.author ?? "No Author",
      publicationYear: bookData.publicationYear ?? new Date().getFullYear()
    }

    books.push(newBook);
    return newBook;
  }

  updateBook(bookID: number, bookData: Partial<Book>): Book | undefined {
    const bookIndex = books.findIndex(book => book.id === bookID);

    if (bookIndex === -1) return undefined;

    const currentBook = books[bookIndex];
    const updatedBook: Book = {
      ...currentBook,
      ...bookData,
    };

    books[bookIndex] = updatedBook;
    return updatedBook;
  }

  deleteBook(bookID: number): Book | undefined {
    const bookIndex = books.findIndex(book => book.id === bookID);

    if (bookIndex === -1) {
      return undefined;
    }

    const [removedBook] = books.splice(bookIndex, 1);
    return removedBook;
  }
}
