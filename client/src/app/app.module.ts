import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from 'ngx-toastr';
import { HeaderComponent } from './components/partials/header/header.component';
import { FooterComponent } from './components/partials/footer/footer.component';
import { NavBarComponent } from './components/partials/nav-bar/nav-bar.component';
import { BookComponent } from './components/partials/book/book.component';
import { CartComponent } from './components/partials/cart/cart.component';
import { CommentComponent } from './components/partials/comment/comment.component';
import { AddBookComponent } from './components/pages/add-book/add-book.component';
import { ViewBookComponent } from './components/pages/view-book/view-book.component';
import { EditBookComponent } from './components/pages/edit-book/edit-book.component';
import { StoreBookComponent } from './components/pages/store-book/store-book.component';
import { HomeComponent } from './components/pages/home/home.component';
import { LoginComponent } from './components/pages/login/login.component';
import { ProfileComponent } from './components/pages/profile/profile.component';
import { RegisterComponent } from './components/pages/register/register.component';
import { CommentTimePipe } from './shared/pipes/comment-time.pipe';
import { ShortenStringPipe } from './shared/pipes/shorten-string.pipe';
import { IsIsbnDirective } from './shared/directives/is-isbn.directive';
import { ReceiptsComponent } from './components/pages/receipts/receipts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TextInputComponent } from './components/partials/text-input/text-input.component';
import { InputValidatonComponent } from './components/partials/input-validaton/input-validaton.component';
import { InputContainerComponent } from './components/partials/input-container/input-container.component';
import { DefaultButtonComponent } from './components/partials/default-button/default-button.component';
import { LoadingInterceptor } from './shared/interceptors/loading.interceptor';
import { LoadingSvgComponent } from './components/partials/Loader/loading-svg/loading-svg.component';
import { LoadingCoverComponent } from './components/partials/Loader/loading-cover/loading-cover.component';
import { AuthInterceptor } from './shared/interceptors/auth.interceptor';
import { BookSliderComponent } from './components/partials/book-slider/book-slider.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { StarRatingComponent } from './components/partials/star-rating/star-rating.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ContactComponent } from './pages/contact/contact.component';
import { ViewContactComponent } from './pages/view-contact/view-contact.component';
import { UpdateprofileComponent } from './pages/updateprofile/updateprofile.component';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
  direction: 'horizontal',
  slidesPerView: 'auto'
};

@NgModule({
  declarations: [
    
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavBarComponent,
    BookComponent,
    CartComponent,
    CommentComponent,
    AddBookComponent,
    ViewBookComponent,
    EditBookComponent,
    StoreBookComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    CommentTimePipe,
    ShortenStringPipe,
    IsIsbnDirective,
    ReceiptsComponent,
    TextInputComponent,
    InputValidatonComponent,
    InputContainerComponent,
    DefaultButtonComponent,
    LoadingSvgComponent,
    LoadingCoverComponent,
    StarRatingComponent,
    BookSliderComponent,
    ContactComponent,
    ViewContactComponent,
    UpdateprofileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-right',
      newestOnTop: false
    }),
    HttpClientModule,
    SwiperModule,
    NgxPaginationModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
