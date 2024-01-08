import { isIsbnValidator } from 'src/app/shared/directives/is-isbn.directive';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService } from 'src/app/services/book.service';
import { IBook } from 'src/app/shared/interfaces/IBook';
import { ToastrService } from 'ngx-toastr';
import { timer } from 'rxjs';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  editBookForm: FormGroup;
  isSubmitted = false;
  id: string;


  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private bookService: BookService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this._initForm();
    this.id = this.activatedRoute.snapshot.paramMap.get('bookId')
    this.bookService.getSingleBook(this.id).subscribe((res) => {
      this.editBookForm.patchValue({ ...res.data });
    })
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }
  private _initForm() {
    this.editBookForm = this.formBuilder.group({
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
  }

  get formcontrol() {
    return this.editBookForm.controls;
  }


  submit() {
    this.isSubmitted = true;
    if (this.editBookForm.invalid) return;

    if (!isIsbnValidator(this.editBookForm.value.isbn)) {
      window.alert("Please enter valid ISBN")
    }
    else {
      const editBookFMContorl = this.editBookForm.value;
      const book: IBook = {
        title: editBookFMContorl.title,
        author: editBookFMContorl.author,
        genre: editBookFMContorl.genre,
        year: editBookFMContorl.year,
        description: editBookFMContorl.description,
        cover: editBookFMContorl.cover,
        isbn: editBookFMContorl.isbn,
        pagesCount: editBookFMContorl.pagesCount,
        price: editBookFMContorl.price
      };
      this._editBook(book);

    }
  }
  private _editBook(bookData: any) {
    this.bookService.editBook(this.id, bookData).subscribe((res: any) => {
      this.toastrService.success(
        `Book ${res.data.title} is updated!`,
        'Success'
      )
      timer(500)
        .toPromise()
        .then(() => {
          this.router.navigateByUrl(`/book/view/${res.data._id}`);
        });
    },
      (err) => {
        this.toastrService.error(
          err.error.message,
          'Book update Failed'
        )
      }
    );

  }
}
