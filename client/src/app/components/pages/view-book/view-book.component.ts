import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/shared/models/book.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { HelperService } from 'src/app/services/helper.service';
import { CartService } from 'src/app/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit {
  endSubs$ = new Subject<void>();
  book: Book;
  bookId: string;
  userId: string;
  isLogged: boolean;
  isAdmin: boolean;
  isRated: boolean;
  isAdded: boolean;
  isBought: boolean;
  stars = ['', '', '', '', ''];

  constructor(private bookService: BookService,
    private route: ActivatedRoute,
    private helperService: HelperService,
    private router: Router,
    private cartService: CartService,
    private toastrService: ToastrService
  ) { }


  ngOnInit(): void {

    this.bookId = this.route.snapshot.paramMap.get('bookId');

    this.isLoggedIn();
    this.isUserAdmin();
    this.getUserId();

    this.route.params.subscribe((params) => {
      if (params['bookId']) {
        this._getBook(params['bookId']);
      }
    });

  }


  buyBook(): void {
    this.cartService.addToCart(this.bookId).subscribe((res) => {
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

  addToFavorites(): void {
    this.bookService.addToFavourites(this.bookId).subscribe((res) => {
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

  rateBook(rating: number): void {
    if (!this.isRated) {
      this.isRated = true;
      this.bookService
        .rateBook(this.bookId, { rating: rating })
        .subscribe((res) => {
          this.book.currentRating = res.data.currentRating;
          this.book.ratedCount++;
          this.calcRating(this.book.currentRating);
        });
    }
  }

  calcRating(rating: number): void {
    this.stars = ['', '', '', '', ''];
    rating = Math.round(rating);
    for (let i = 0; i < rating; i++) {
      this.stars[i] = 'checked';
    }
  }

  resetRating(): void {
    this.calcRating(this.book.currentRating);
  }

  login(): void {
    this.router.navigate(['/user/login']);
  }

  private getUserId(): void {
    if (!this.userId) {
      let tokeninfo = this.helperService.getProfile()
      if (tokeninfo.length > 0) {
        this.userId = tokeninfo.sub.id
      }

    }
  }

  private isLoggedIn(): boolean {
    let tokeninfo = this.helperService.isLoggedIn()
    if (tokeninfo.exp > Date.now() / 1000) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
    return this.isLogged;
  }

  private isUserAdmin(): boolean {

    if (!this.isAdmin) {
      let tokeninfo = this.helperService.isAdmin()

      if (tokeninfo.sub.isAdmin) {
        this.isAdmin = true;


      } else {
        this.isAdmin = false;
      }


    }

    return this.isAdmin;
  }

  private _getBook(id: string) {
    this.bookService.getSingleBook(id).pipe(takeUntil(this.endSubs$)).subscribe((res) => {
      this.book = res.data

    }, error => {
      console.log('error from getSingleBook home page', error)
    });
  }

  deleteBook(id: string) {

    if (confirm("Are you sure want to delete " + this.book.title)) {
      this.bookService.deleteBook(id).subscribe((res) => {


        this.toastrService.success(
          `Book ${res.data.title} is deleted!`,
          'Success'
        )
        timer(2000)
          .toPromise()
          .then(() => {
            this.router.navigateByUrl(`/home`);
          });
      },
        (err) => {
          this.toastrService.error(
            err.error.message,
            'Book deletion Failed'
          )
        }
      );

    }

  }

}
