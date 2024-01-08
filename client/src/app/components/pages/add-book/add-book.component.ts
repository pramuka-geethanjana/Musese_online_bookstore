import { isIsbnValidator } from 'src/app/shared/directives/is-isbn.directive';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { UserService } from 'src/app/services/user.service';
import { IBook } from 'src/app/shared/interfaces/IBook';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css']
})
export class AddBookComponent implements OnInit {
  addBookForm: FormGroup;
  isSubmitted = false;

  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.addBookForm = this.formBuilder.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      genre: ['', Validators.required],
      year: ['', Validators.required],
      description: ['', [Validators.required, Validators.minLength(10)]],
      cover: ['', Validators.required],
      isbn: ['', [Validators.required]],
      pagesCount: ['', [Validators.required, Validators.min(0)]],
      price: ['', [Validators.required, Validators.min(0)]],
    })
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get formcontrol() {
    return this.addBookForm.controls;
  }


  submit() {
    this.isSubmitted = true;
    if (this.addBookForm.invalid) return;

    if (!isIsbnValidator(this.addBookForm.value.isbn)) {
      window.alert("Please enter valid ISBN")
    }
    else {
      const addBookFMContorl = this.addBookForm.value;
      const book: IBook = {
        title: addBookFMContorl.title,
        author: addBookFMContorl.author,
        genre: addBookFMContorl.genre,
        year: addBookFMContorl.year,
        description: addBookFMContorl.description,
        cover: addBookFMContorl.cover,
        isbn: addBookFMContorl.isbn,
        pagesCount: addBookFMContorl.pagesCount,
        price: addBookFMContorl.price
      };
      this._addBook(book);

    }
  }
  private _addBook(bookData: any) {
    this.bookService.createBook(bookData).subscribe((res: any) => {
      this.toastrService.success(
        `Book ${res.data.title} is created!`,
        'Success'
      )
      timer(2000)
        .toPromise()
        .then(() => {
          this.router.navigateByUrl(`/book/view/${res.data._id}`);
        });
    },
      (err) => {
        this.toastrService.error(
          err.error.message,
          'Book creation Failed'
        )
      }
    );

  }

}
