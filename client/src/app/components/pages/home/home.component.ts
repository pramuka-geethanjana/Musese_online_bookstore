import { Component, OnInit } from '@angular/core';
import { BookService } from 'src/app/services/book.service';
import { Book } from 'src/app/shared/models/book.model'

const newestBooksQuery = '?sort={"creationDate":-1}&limit=5';
const bestRatedBooksQuery = '?sort={"currentRating":-1}&limit=5';
const mostPurchasedBooksQuery = '?sort={"purchasesCount":-1}&limit=5';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  newestBooks!: Book[];
  bestRatedBooks!: Book[];
  mostPurchasedBooks!: Book[];

  constructor(private bookService: BookService) {

  }

  ngOnInit(): void {
    this.bookService.search(newestBooksQuery).subscribe((res) => {
      this.newestBooks = res.data;
    });

    this.bookService.search(bestRatedBooksQuery).subscribe((res) => {
      this.bestRatedBooks = res.data;
    });

    this.bookService.search(mostPurchasedBooksQuery).subscribe((res) => {
      this.mostPurchasedBooks = res.data;
    });
  }


}


