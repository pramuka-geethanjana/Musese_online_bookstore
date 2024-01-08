import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, OnChanges {
  searchTerm = '';

  searchForm: FormGroup;
  isLoggedSub$: Subscription;
  cartStatusSub$: Subscription;
  favBooksStatusSub$: Subscription;
  username: string;
  isLogged: boolean;
  isAdmin: boolean;
  statusChecker: number;
  cartItems: number;
  user!: any;
  imageUrl: string;
  favoriteBooks: number;

  constructor(
    private router: Router,
    private helperService: HelperService,
    private cartService: CartService,
    private userService: UserService,
    private bookService: BookService
  ) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    })

    this.username = this.user.user.username;
  }

  ngOnInit(): void {

    this.statusChecker = window.setInterval(() => this.tick(), 600000);



    if (this.user) {
      this.imageUrl = this.user.user.avatar
      this.username = this.user.user.username;

    }


    let tokeninfo = this.helperService.isLoggedIn()
    if (tokeninfo.exp > Date.now() / 1000) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    this.initForm();
    if (this.isLogged) {
      this.getCartSize();
      this.getFavoriteBooksCount()
    }

    this.isLoggedSub$ = this.helperService.isUserLogged.subscribe((data) => {
      this.isLogged = data;
    });

    this.cartStatusSub$ = this.helperService.cartStatus.subscribe((data) => {
      if (data === 'add') {
        this.cartItems++;
      } else if (data === 'remove') {
        this.cartItems--;
      } else if (data === 'updateStatus') {
        this.getCartSize();
      }
    });

    this.favBooksStatusSub$ = this.helperService.favBooksStatus.subscribe((data) => {
      if (data === 'add') {
        this.favoriteBooks++;
      } else if (data === 'remove') {
        this.favoriteBooks--;
      } else if (data === 'updateStatus') {
        this.getFavoriteBooksCount();
      }
    });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.statusChecker);
    this.isLoggedSub$.unsubscribe();
    this.cartStatusSub$.unsubscribe();
  }

  initForm(): void {
    this.searchForm = new FormGroup({
      'query': new FormControl('', [
        Validators.required
      ])
    });

  }

  onSubmit(): void {
    const query: string = this.searchForm.value.query.trim();
    if (query.length !== 0) {
      //this.router.navigate([`/book/store/${query}`]);
      //this.helperService.searchQuery.next();
      console.log(query)

    }
  }

  tick(): void {
    let tokeninfo = this.helperService.isLoggedIn()
    if (tokeninfo.exp > Date.now() / 1000) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  isUserLogged(): any {
    return this.isLogged;
  }


  getCartSize(): void {
    this.cartService.getCartSize().subscribe((res) => {
      this.cartItems = res.data;
    });
  }

  getFavoriteBooksCount(): void {
    this.bookService.getfavoriteBooksCount().subscribe((res) => {
      this.favoriteBooks = res.data;
    })
  }


  naviageToProfile() {
    this.router.navigateByUrl(`/user/profile/${this.username}`);
  }


  naviageToCart() {
    this.router.navigateByUrl(`/cart`);
  }

}
