import { Component, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, debounceTime, distinctUntilChanged, timer } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { CartService } from 'src/app/services/cart.service';
import { HelperService } from 'src/app/services/helper.service';
import { Book } from 'src/app/shared/models/book.model';
import { Cart } from 'src/app/shared/models/cart.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cart: Cart;
  cartForm: FormGroup;
  changesSub$: Subscription;
  removeModalRef: any;
  lastCartState: string;
  lastDeleteId: string;
  isAdded: boolean;
  isCartEmpty = true;
  cartLength: any
  constructor(
    private router: Router,
    private cartService: CartService,
    private helperService: HelperService,
    private toastrService: ToastrService,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe((res) => {
      this.cart = res.data;
      this.isCartEmpty = false;

      this.cartForm = this.toFormGroup(this.cart.books);
      this.cartLength = this.cart.books.length

      this.onChanges();
    });


  }

  ngOnDestroy(): void {
    this.changesSub$.unsubscribe();
  }

  toFormGroup(books: Book[]): FormGroup {
    const group: any = {};

    books.forEach(book => {
      group[book._id] = new FormControl(
        book.qty || '', [
        Validators.required,
        Validators.min(1),
        Validators.max(20)
      ]);
    });

    return new FormGroup(group);
  }

  onChanges(): void {
    this.changesSub$ = this.cartForm
      .valueChanges
      .pipe(
        debounceTime(800),
        distinctUntilChanged()
      )
      .subscribe(val => {
        if (this.lastCartState !== JSON.stringify(val)) {
          this.lastCartState = JSON.stringify(val);
          this.reCalcSum(val);
        }
      });
  }


  onRemove(): void {
    this.cartService.removeFromCart(this.lastDeleteId).subscribe(() => {
      this.helperService.cartStatus.next('remove');
      this.cart.books = this.cart.books.filter(b => b._id !== this.lastDeleteId);
      this.reCalcSum(this.cartForm.value);

    });
  }

  onSubmit(): void {
    this.cartService.checkout(this.cartForm.value).subscribe((res) => {

      this.toastrService.success(
        `Order Updated!`,
        'Success'
      )
      timer(500)
        .toPromise()
        .then(() => {
          this.helperService.cartStatus.next('updateStatus');
          this.router.navigate(['/user/purchaseHistory']);
        });
    },
      (err) => {
        this.toastrService.error(
          err.error.message,
          'Order update Failed'
        )
      }
    )
  }


  reCalcSum(formValues: object): void {
    let price = 0;
    for (const b of this.cart.books) {
      price += b.price * formValues[b._id];
    }

    this.cart.totalPrice = price;
  }

  getControl(id: string) {
    return this.cartForm.get(id);
  }

  removeBook(id: string) {
    const state = confirm(`Are you sure want to delete ${id}`)
    this.lastDeleteId = id;
    this.isCartEmpty = true


    if (state) {
      this.onRemove()
    }
  }

  saveBook(id: string) {

    this._addToFavorites(id)
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
