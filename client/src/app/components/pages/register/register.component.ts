import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { IUserRegister } from 'src/app/shared/interfaces/IUserRegister';
import { PasswordsMatchValidator } from 'src/app/shared/validators/password_match_validator';

const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm!: FormGroup;
  isSubmitted = false;
  imageDisplay?: string | ArrayBuffer;
  selectedImageFile: File | null = null;
  uploadedImageUrl: string;

  returnUrl = '';
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(5)]],
      email: ['', [Validators.required, Validators.email, Validators.pattern(emailRegex)]],
      password: ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword: ['', Validators.required],
      avatar: ['']

    }, {
      validators: PasswordsMatchValidator('password', 'confirmPassword')
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }

  get formcontrol() {
    return this.registerForm.controls;
  }

  submit() {
    this.isSubmitted = true;
    if (this.registerForm.invalid) return;

    const fv = this.registerForm.value;

    const user: IUserRegister = {
      username: fv.username,
      email: fv.email,
      password: fv.password,
      confirmPassword: fv.confirmPassword,
      avatar: this.uploadedImageUrl
    };

    this.userService.register(user).subscribe(_ => {
      this.router.navigateByUrl(this.returnUrl);
    })
  }

  onImageUpload(event: any) {

    const file: File = event.target.files[0];
    this.selectedImageFile = file;

    if (file) {
      this.registerForm.patchValue({ avatar: file });
      const imageControl = this.registerForm?.get('avatar');
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

    const formData = new FormData();
    formData.append('image', file);
    this.userService.changeAvatar(formData).subscribe((resData) => {

      this.uploadedImageUrl = resData.data.imageURL;
      this.toastrService.success(
        `Profiel Image Changed!`,
        'Upload Successful'
      )
    }, err => {
      console.log('error upload image response', err);
      this.toastrService.error('Server Error occured', err.error.message);

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
