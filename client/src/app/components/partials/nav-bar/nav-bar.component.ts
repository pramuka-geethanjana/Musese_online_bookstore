import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/services/cart.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  searchForm: FormGroup;
  isLoggedSub$: Subscription;
  cartStatusSub$: Subscription;
  username: string;
  isLogged: boolean;
  isAdmin: boolean;
  statusChecker: number;
  cartItems = 0;

  constructor(
    private router: Router,
    private helperService: HelperService,
    private cartService: CartService
  ) { }

  ngOnInit(): void {
    this.statusChecker = window.setInterval(() => this.tick(), 600000);
    let tokeninfo = this.helperService.isLoggedIn()
    if (tokeninfo.exp > Date.now() / 1000) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }

    if (this.isLogged) {
      this.getCartSize();
    }

    this.isLoggedSub$ = this.helperService
      .isUserLogged
      .subscribe((data) => {
        this.isLogged = data;
      });

    this.cartStatusSub$ = this.helperService
      .cartStatus
      .subscribe((data) => {
        if (data === 'add') {
          this.cartItems++;
        } else if (data === 'remove') {
          this.cartItems--;
        } else if (data === 'updateStatus') {
          this.getCartSize();
        }
      });
  }

  ngOnDestroy(): void {
    window.clearInterval(this.statusChecker);
    this.isLoggedSub$.unsubscribe();
    this.cartStatusSub$.unsubscribe();
  }

  naviageToProfile() {
    this.router.navigateByUrl(`/user/profile/${this.username}`);
  }

  tick(): void {
    let tokeninfo = this.helperService.isLoggedIn()
    if (tokeninfo.exp > Date.now() / 1000) {
      this.isLogged = true;
    } else {
      this.isLogged = false;
    }
  }

  isUserLogged(): boolean {
    return this.isLogged;
  }

  isUserAdmin(): boolean {

    if (!this.isAdmin) {
      let tokeninfo = this.helperService.isAdmin()
      if (tokeninfo.sub.isAdmin) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }

    }

    return this.isAdmin;
  }

  getUsername(): void {
    if (!this.username) {
      let tokeninfo = this.helperService.getProfile()
      this.username = tokeninfo.sub.username
    }
  }

  getCartSize(): void {
    this.cartService.getCartSize().subscribe((res) => {
      this.cartItems = res.data;
    });
  }

  logout(): void {
    this.username = undefined;
    this.isAdmin = undefined;
    this.cartItems = undefined;
    this.helperService.clearSession();
    this.helperService.isUserLogged.next(false);
  }

}
