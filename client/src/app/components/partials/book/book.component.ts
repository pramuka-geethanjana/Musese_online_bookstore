import { ToastrService } from 'ngx-toastr';
import { CartService } from './../../../services/cart.service';
import { Component, Input } from '@angular/core';
import { HelperService } from 'src/app/services/helper.service';
import { Book } from 'src/app/shared/models/book.model';
import { timer } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent {
  @Input('book') book: Book;
  isBought = false;
  isAdded = false;

  constructor(private cartService: CartService,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private bookService: BookService,
    private router: Router

  ) { }

  handleClickSearch() {
    console.log('handleClickSearch')
  }

  handleClickfav(id: string) {
    this._addToFavorites(id);
  }

  handleClickview(id: string) {
    this.router.navigateByUrl(`/book/view/${id}`);
  }

  addToCart(id: string) {
    this._buyBook(id)
  }

  private _buyBook(id: string): void {
    this.cartService.addToCart(id).subscribe((res) => {
      this.helperService.cartStatus.next('add');
      this.isBought = true;
      this.toastrService.success(
        `Book Added to cart`,
        'Adding Success'
      )
      timer(3000)
        .toPromise()
        .then(() => {
          this.isBought = true;
        });
    },
      (err) => {
        console.log(err)
        this.toastrService.error(
          err.error.message,
          'Adding to cart Failed'
        )
      }
    )

  }

  private _addToFavorites(id: string): void {
    this.bookService.addToFavourites(id).subscribe((res) => {
      this.helperService.favBooksStatus.next('add');
      this.isAdded = true;
      this.toastrService.success(
        `Book Added to Favourite`,
        'Adding Success'
      )
    },
      (err) => {
        console.log(err)
        this.toastrService.error(
          err.error.message,
          'Adding to Favourite Failed'
        )
      }
    )


  }
}
