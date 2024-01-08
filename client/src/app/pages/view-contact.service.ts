import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8000/messages';

  constructor(private http: HttpClient) {}

  getMessages() {
    return this.http.get(this.apiUrl);
  }

  updateMessage(id: string, email: string) {
    return this.http.put(`${this.apiUrl}/${id}`, { email });
  }

  deleteMessage(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
