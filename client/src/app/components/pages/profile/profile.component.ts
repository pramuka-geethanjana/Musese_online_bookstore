import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommentService } from 'src/app/services/comment.service';
import { HelperService } from 'src/app/services/helper.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/user.model';
import { Comment } from 'src/app/shared/models/comment.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User;
  comments: Comment[];
  avatarForm: FormGroup;
  routeChangeSub$: Subscription;
  currentUserId: any;
  isAdmin: boolean;
  userId: string;
  role = 'User';
  newImageDisplay: string | ArrayBuffer;
  uploadedImageUrl: string;
  selectedImageFile: File | null = null;
  imageDisplay?: string | ArrayBuffer;

  constructor(
    private route: ActivatedRoute,
    private commentService: CommentService,
    private userService: UserService,
    private helperService: HelperService,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.avatarForm = this.formBuilder.group({
      avatar: ['']

    })

    this.routeChangeSub$ = this.route.params.subscribe((params) => {
      let username = params['username'];
      if (username === 'mine') {
        username = this.helperService.getProfile().username;
      }

      this.userService
        .getProfile(username)
        .subscribe((res) => {
          this.user = res.data;
          this.getComments();
        });
    });

    this.isAdmin = this.isUserAdmin();
    if (this.isAdmin) {
      this.role = 'Admin'
    } else {
      this.role = 'User'
    }
    this.currentUserId = this.getUserId();


    this.avatarForm = new FormGroup({
      'avatar': new FormControl('', [
        Validators.required])
    });
  }

  ngOnDestroy(): void {
    this.routeChangeSub$.unsubscribe();
  }

  getComments(): void {
    this.commentService
      .getLatestFiveComments(this.user.id)
      .subscribe((res) => {
        this.comments = res.data;
      });
  }

  getUserId(): any {
    if (!this.userId) {
      let tokeninfo = this.helperService.getProfile()
      if (tokeninfo.length > 0) {
        if (tokeninfo.sub.id) {
          this.userId = tokeninfo.sub.id;
        } else {
          this.userId = null;
        }

      }

    }
  }

  private isUserAdmin(): boolean {

    if (!this.isAdmin) {
      let tokeninfo = this.helperService.isAdmin()
      if (tokeninfo) {
        this.userId = tokeninfo.sub.id;
        if (tokeninfo.sub.isAdmin) {
          this.isAdmin = true;
        } else {
          this.isAdmin = false;
        }
      }


    }

    return this.isAdmin;
  }


  blockComments(id: string): void {
    this.userService
      .blockComments(id)
      .subscribe();
  }

  unblockComments(id: string): void {
    this.userService
      .unblockComments(id)
      .subscribe();
  }

  onImageUpload(event: any) {

    const file: File = event.target.files[0];
    this.selectedImageFile = file;

    const formData = new FormData();
    formData.append('image', event.target.files[0]);


    if (file) {
      this.avatarForm.patchValue({ avatar: file });
      const imageControl = this.avatarForm?.get('avatar');
      if (imageControl) {
        imageControl.setValue(file);
        imageControl.markAsDirty();
        imageControl.markAsTouched();
        imageControl.updateValueAndValidity();
      }
      const fileReader = new FileReader();

      fileReader.onload = () => {
        this.imageDisplay = fileReader.result as string;

      };

      fileReader.readAsDataURL(file);
    }


    const data = {
      image: file
    }

    this.userService.changeUserAvatar(data, this.userId).subscribe((resData) => {

      this.uploadedImageUrl = resData.data.imageURL;
      this.imageDisplay = this.uploadedImageUrl;

      this.toastrService.success(
        `Profiel Image Changed!`,
        'Upload Successful'
      )

    }, err => {
      console.log('error upload image response', err);
      this.toastrService.error('', err.error.message);

    })

  }

  selectOtherImage(event: any) {

    const fileInput: HTMLInputElement = document.getElementById('fileInput') as HTMLInputElement;

    fileInput.addEventListener('change', this._handleImageSelect);
    fileInput.click();

  }

  private _handleImageSelect(event) {
    const inputElement = event.target as HTMLInputElement;
    const selectedFile = inputElement.files[0];

  }


}
