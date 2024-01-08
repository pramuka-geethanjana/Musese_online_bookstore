import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };
 
  private webSocket: WebSocket;

  constructor() {
    this.initWebSocket();
  }

  initWebSocket() {

    this.webSocket = new WebSocket('ws://localhost:3000');

    this.webSocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    this.webSocket.onmessage = (event) => {
      console.log('Message from server: ', event.data);
    };

    this.webSocket.onerror = (error) => {
      console.error('WebSocket error: ', error);
    };

    this.webSocket.onclose = (event) => {
      console.log('WebSocket connection closed: ', event);
    };
  }

  onSubmit() {
    console.log('Form data', this.contact);

    if (this.webSocket.readyState === WebSocket.OPEN) {
      this.webSocket.send(JSON.stringify(this.contact));
    } else {
      console.error('WebSocket is not open. Cannot send data');
    }

    window.location.reload(); 
  }

  ngOnDestroy() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}