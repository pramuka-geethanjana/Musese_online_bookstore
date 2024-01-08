import { query } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { BookService } from 'src/app/services/book.service';
import { HelperService } from 'src/app/services/helper.service';
import { Book } from 'src/app/shared/models/book.model';


@Component({
  selector: 'app-store-book',
  templateUrl: './store-book.component.html',
  styleUrls: ['./store-book.component.css']
})
export class StoreBookComponent implements OnInit, OnDestroy {

  currentQuery: string;
  pageSize = 10;
  currentPage = 1;
  total = 30;
  maxPages = 8;
  querySub$: Subscription;
  routeChangeSub$: Subscription;
  books: Book[];

  constructor(
    private route: ActivatedRoute,
    private bookSevice: BookService,
    private helperService: HelperService
  ) { }

  ngOnInit(): void {
    this.routeChangeSub$ = this.route.params.subscribe((params) => {
      this.currentQuery = params.query;

      this.initRequest(this.currentQuery);
    });

    this.querySub$ = this.helperService.searchQuery.subscribe(() => {
      this.currentPage = 1;
    });
  }

  ngOnDestroy(): void {
    this.routeChangeSub$.unsubscribe();
    this.querySub$.unsubscribe();
  }

  initRequest(query: string): void {
    query = this.generateQuery(query);

    this.bookSevice.search(query).subscribe((res) => {
      this.total = res.itemsCount;
      this.books = res.data;
    });
  }

  generateQuery(query: string): string {
    if (query === 'default') {
      return `?sort={"creationDate":-1}&skip=${(this.currentPage - 1) * this.pageSize}&limit=${this.pageSize}`
    } else {

      return `?query={"searchTerm":"${query}"}&sort={"creationDate":-1}&skip=${(this.currentPage - 1) * this.pageSize}&limit=${this.pageSize}`
    }

  }

  pageChanged(newPage: any): void {
    this.currentPage = newPage;
    this.initRequest(this.currentQuery);
  }


}
