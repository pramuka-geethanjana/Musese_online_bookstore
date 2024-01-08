import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { ServerRes } from '../shared/models/server-res.model'
import { Cart } from '../shared/models/cart.model';

const APIURL = 'http://localhost:8000/api/v1';
const getCartUrl = APIURL + '/cart';
const getCartSizeUrl = APIURL + '/cart/getSize';
const addToCartUrl = APIURL + '/cart/add/';
const removeFromCartUrl = APIURL + '/cart/delete/';
const checkoutUrl = APIURL + '/cart/checkout';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private http: HttpClient) { }

  getCartSize(): Observable<ServerRes<number>> {
    return this.http.get<ServerRes<number>>(getCartSizeUrl);
  }

  getCart(): Observable<ServerRes<Cart>> {
    return this.http.get<ServerRes<Cart>>(getCartUrl)
      .pipe(
        map(res => {
          res.data.books.map(b => b.qty = 1);
          return res;
        })
      );
  }

  addToCart(id: string): Observable<ServerRes<Cart>> {
    return this.http.post<ServerRes<Cart>>(addToCartUrl + id, {});
  }

  removeFromCart(id: string): Observable<ServerRes<Cart>> {
    return this.http.delete<ServerRes<Cart>>(removeFromCartUrl + id);
  }

  checkout(payload: object): Observable<ServerRes<object>> {
    return this.http.post<ServerRes<object>>(checkoutUrl, payload);
  }
}
