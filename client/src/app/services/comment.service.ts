import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comment } from '../shared/models/comment.model'
import { ServerRes } from '../shared/models/server-res.model';
import { HttpClient } from '@angular/common/http';



const APIURL = 'http://localhost:8000/api/v1';
const getCommentUrl = APIURL + '/comment';
const addCommentUrl = APIURL + '/comment/add/';
const editCommentUrl = APIURL + '/comment/edit/';
const deleteCommentUrl = APIURL + '/comment/delete/';
const getLatestFiveUrl = APIURL + '/comment/getLatestFiveByUser/';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComments(id: string, page: string): Observable<ServerRes<Comment[]>> {
    return this.http.get<ServerRes<Comment[]>>(`${getCommentUrl}/${id}/${page}`);
  }

  getLatestFiveComments(id: string): Observable<ServerRes<Comment[]>> {
    return this.http.get<ServerRes<Comment[]>>(getLatestFiveUrl + id);
  }

  addComment(id: string, payload: Comment): Observable<ServerRes<Comment>> {
    return this.http.post<ServerRes<Comment>>(addCommentUrl + id, payload);
  }

  editComment(id: string, payload: Comment): Observable<ServerRes<Comment>> {
    return this.http.put<ServerRes<Comment>>(editCommentUrl + id, payload);
  }

  deleteComment(id: string): Observable<ServerRes<object>> {
    return this.http.delete<ServerRes<object>>(deleteCommentUrl + id);
  }
}
