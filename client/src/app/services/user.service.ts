import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ServerRes } from '../shared/models/server-res.model'
import { User } from '../shared/models/user.model';
import { Receipt } from '../shared/models/receipt.model';
import { ToastrService } from 'ngx-toastr';

const APIURL = 'http://localhost:8000/api/v1/user';
const registerUrl = APIURL + '/register';
const loginUrl = APIURL + '/login';
const profileUrl = APIURL + '/profile/';
const getPurchaseHistoryUrl = APIURL + '/purchaseHistory';
const changeAvatarUrl = APIURL + '/changeAvatar';
const blockCommentsUrl = APIURL + '/blockComments/';
const unblockCommentsUrl = APIURL + '/unlockComments/';
const uploadProfileImageUrl = APIURL + '/uploadProfileImage';
const changeProfileImageUrl = APIURL + '/uploadProfileImage/';


const USER_KEY = 'User';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject = new BehaviorSubject<any>(this.getUserFromLocalStorage());
  public userObservable: Observable<any>;

  constructor(private http: HttpClient, private toastrService: ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }

  public get currentUser(): any {
    return this.userSubject.value;
  }

  register(payload: object): Observable<ServerRes<User>> {
    return this.http.post<ServerRes<User>>(registerUrl, payload).pipe(
      tap({
        next: (serverRes) => {
          this.setUserToLocalStorage(serverRes.data);
          this.userSubject.next(serverRes.data);
          this.toastrService.success(
            `Welcome to the Book Store Website`,
            'Register Successful'
          )
          location.replace("/home");
        },
        error: (errorResponse) => {
          if (errorResponse.statusText == 'Unknown Error') {
            this.toastrService.error('Unknown Server Error occured', 'Register Failed');
          } else {
            this.toastrService.error(errorResponse.error.message, 'Register Failed')

          }
        }
      })
    );
  }

  login(payload: object): Observable<ServerRes<User>> {
    return this.http.post<ServerRes<User>>(loginUrl, payload).pipe(
      tap({
        next: (serverRes) => {
          this.setUserToLocalStorage(serverRes.data);
          this.userSubject.next(serverRes.data);
          this.toastrService.success(
            `Welcome to Book Store Website !`,
            'Login Successful'
          )
          location.replace("/home");
        },
        error: (errorResponse) => {
          console.log(errorResponse)
          if (errorResponse.statusText == 'Unknown Error') {
            this.toastrService.error('Unknown Server Error occured', 'Login Failed');
          } else {
            this.toastrService.error(errorResponse.error.message, 'Login Failed');

          }
        }
      })
    );

  }

  getProfile(username: string): Observable<ServerRes<User>> {
    return this.http.get<ServerRes<User>>(profileUrl + username);
  }

  getPurchaseHistory(): Observable<ServerRes<Receipt[]>> {
    return this.http.get<ServerRes<Receipt[]>>(getPurchaseHistoryUrl);
  }

  changeAvatar(payload: any): Observable<ServerRes<any>> {
    return this.http.post<ServerRes<any>>(uploadProfileImageUrl, payload);
  }

  changeUserAvatar(payload: any, userId: any): Observable<ServerRes<any>> {
    return this.http.put<ServerRes<any>>(changeProfileImageUrl + userId, payload);
  }

  blockComments(id: string): Observable<ServerRes<object>> {
    return this.http.post<ServerRes<object>>(blockCommentsUrl + id, {});
  }

  unblockComments(id: string): Observable<ServerRes<object>> {
    return this.http.post<ServerRes<object>>(unblockCommentsUrl + id, {});
  }

  private setUserToLocalStorage(user: any) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage(): any {
    const userJson = localStorage.getItem(USER_KEY);
    if (userJson) return JSON.parse(userJson);
    return null;
  }

}
