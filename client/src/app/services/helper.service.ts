import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import jwt_decode from "jwt-decode";
import { UserService } from './user.service';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  isUserLogged = new Subject<boolean>();
  searchQuery = new Subject<string>();
  cartStatus = new Subject<string>();
  favBooksStatus = new Subject<string>();
  userObj!: any;


  constructor(
    private cartService: CartService,
    private userService: UserService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.userObj = newUser;
    })
  }

  clearSession(): void {
    localStorage.clear();
    window.location.reload();
  }

  getProfile(): any {
    try {
      const tokenInfo = jwt_decode(this.userObj.token);// decode token

      return tokenInfo;

    } catch (err) {
      return {};
    }
  }

  isLoggedIn(): any {
    try {
      const tokenInfo = jwt_decode(this.userObj.token); // decode token

      return tokenInfo;

    } catch (err) {
      return false;
    }
  }

  isAdmin(): any {
    try {
      const tokenInfo = jwt_decode(this.userObj.token); // decode token

      return tokenInfo;

    } catch (err) {
      return false;
    }
  }

}
