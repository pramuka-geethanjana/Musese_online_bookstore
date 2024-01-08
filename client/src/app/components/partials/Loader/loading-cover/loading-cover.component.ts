import { Component, OnInit } from '@angular/core';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading-cover',
  templateUrl: './loading-cover.component.html',
  styleUrls: ['./loading-cover.component.css']
})
export class LoadingCoverComponent implements OnInit {
  isLoading!: boolean;

  constructor(private loadingService: LoadingService) { }

  ngOnInit(): void {
    this.loadingService.isLoading.subscribe((isLoading) => {
      this.isLoading = isLoading;
    })
    //this.loadingService.showLoading()
  }
}
