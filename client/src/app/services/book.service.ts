import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Book } from '../shared/models/book.model'
import { ServerRes } from '../shared/models/server-res.model'
import { IBook } from 'src/app/shared/interfaces/IBook';

import { Observable } from 'rxjs';

const APIURL = 'http://localhost:8000/api/v1';
const getAllBooksUrl = APIURL + '/book';
const getAllBooksBySearchTermUrl = APIURL + '/book/search/';
const getSingleBookUrl = APIURL + '/book/view/';
const createBookUrl = APIURL + '/book/add';
const editBookUrl = APIURL + '/book/edit/';
const deleteBookUrl = APIURL + '/book/delete/';
const rateBookUrl = APIURL + '/book/rate/';
const addToFavoritesUrl = APIURL + '/book/addToFavorites/';
const searchBookUrl = APIURL + '/book/search';
const favoriteBooksCount = APIURL + '/book/favoriteBooksCount';


const endPoint = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({
  providedIn: 'root'
})

export class BookService {

  constructor(private http: HttpClient) { }

  getAllPosts(): Observable<any> {
    return this.http.get(endPoint)
  }

  getAllBooks(): Observable<ServerRes<Book[]>> {
    return this.http.get<ServerRes<Book[]>>(getAllBooksUrl);
  }

  getAllBooksBySearchTerm(searchTerm: string) {
    return this.http.get<ServerRes<Book[]>>(getAllBooksBySearchTermUrl + searchTerm);
  }


  getSingleBook(id: string): Observable<ServerRes<Book>> {
    return this.http.get<ServerRes<Book>>(getSingleBookUrl + id);
  }

  getfavoriteBooksCount(): Observable<ServerRes<number>> {
    return this.http.get<ServerRes<number>>(favoriteBooksCount);
  }

  createBook(payload: IBook): Observable<ServerRes<Book>> {
    return this.http.post<ServerRes<Book>>(createBookUrl, payload);
  }

  editBook(id: string, payload: Book): Observable<ServerRes<Book>> {
    return this.http.put<ServerRes<Book>>(editBookUrl + id, payload);
  }

  deleteBook(id: string): Observable<ServerRes<Book>> {
    return this.http.delete<ServerRes<Book>>(deleteBookUrl + id);
  }

  rateBook(id: string, payload: object): Observable<ServerRes<Book>> {
    return this.http.post<ServerRes<Book>>(rateBookUrl + id, payload);
  }

  addToFavourites(id: string): Observable<ServerRes<Book>> {
    return this.http.post<ServerRes<Book>>(addToFavoritesUrl + id, {});
  }

  search(query: string): Observable<ServerRes<Book[]>> {
    return this.http.get<ServerRes<Book[]>>(searchBookUrl + query);
  }
}
