import { Component, OnInit } from '@angular/core';
import { MessageService } from '../view-contact.service';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent implements OnInit {
  messages: any[] = [];

  constructor(private messageService: MessageService) {}

  ngOnInit() {
    this.messageService.getMessages().subscribe((data: any) => {
      this.messages = data;
    });
  }

  updateMessage(id: string, email: string) {
    this.messageService.updateMessage(id, email).subscribe();
  }

  deleteMessage(id: string) {
    this.messageService.deleteMessage(id).subscribe(() => {
      this.messages = this.messages.filter(message => message._id !== id);
    });
  }
}
