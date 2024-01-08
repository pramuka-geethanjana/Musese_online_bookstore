import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { ReceiptsComponent } from './components/pages/receipts/receipts.component';
import { CartComponent } from './components/partials/cart/cart.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './components/pages/login/login.component';
import { StoreBookComponent } from './components/pages/store-book/store-book.component';
import { ViewBookComponent } from './components/pages/view-book/view-book.component';
import { AddBookComponent } from './components/pages/add-book/add-book.component';
import { EditBookComponent } from './components/pages/edit-book/edit-book.component';
import { IsAuthUserGuard } from './shared/guards/is-auth-user.guard';
import { IsUserGuard } from './shared/guards/is-user.guard';
import { IsAdminGuard } from './shared/guards/is-admin.guard';
import { ContactComponent } from './pages/contact/contact.component';
import { ViewContactComponent } from './pages/view-contact/view-contact.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'user/profile/:username',
    canActivate: [IsAuthUserGuard],
    component: ProfileComponent
  },
  {
    path: 'user/purchaseHistory',
    canActivate: [IsAuthUserGuard],
    component: ReceiptsComponent
  },
  {
    path: 'cart',
    canActivate: [IsAuthUserGuard],
    component: CartComponent
  },
  {
    path: 'user/register',
    canActivate: [IsUserGuard],
    component: RegisterComponent
  },
  {
    path: 'view_contact',
    canActivate: [IsUserGuard],
    component: ViewContactComponent
  },
  {
    path: 'user/login',
    canActivate: [IsUserGuard],
    component: LoginComponent
  },
  {
    path: 'book/store/:query',
    component: StoreBookComponent
  },
  {
    path: 'book/view/:bookId',
    component: ViewBookComponent
  },
  {
    path: 'book/add',
    canActivate: [IsAdminGuard],
    component: AddBookComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'book/edit/:bookId',
    canActivate: [IsAdminGuard],
    component: EditBookComponent
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
