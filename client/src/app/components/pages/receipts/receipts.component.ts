import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Receipt } from 'src/app/shared/models/receipt.model';
import { User } from 'src/app/shared/models/user.model';

@Component({
  selector: 'app-receipts',
  templateUrl: './receipts.component.html',
  styleUrls: ['./receipts.component.css']
})
export class ReceiptsComponent implements OnInit {
  receipts: Receipt[];
  user: any;

  constructor(private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.userService.getPurchaseHistory().subscribe((res) => {
      this.receipts = res.data;
    });

    this.user = this.userService.currentUser.user

  }
}
