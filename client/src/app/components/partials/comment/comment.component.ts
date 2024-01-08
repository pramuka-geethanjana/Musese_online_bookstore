import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Input } from '@angular/core';
import { Comment } from 'src/app/shared/models/comment.model';
import { CommentService } from 'src/app/services/comment.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input('bookId') bookId: string;
  @Input('isLogged') isLogged: boolean;
  @Input('isAdmin') isAdmin: boolean;
  @Input('userId') userId: string;
  commentForm: FormGroup;
  isSubmitted = false;

  comments: Comment[] = [];
  isFromEdit: boolean;
  lastEditId: string;
  lastDeleteId: string;
  action: string;

  constructor(
    private commentService: CommentService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastrService: ToastrService,
    private userService: UserService
  ) { }


  ngOnInit(): void {
    this.commentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
    });

    this.commentService.getComments(this.bookId, this.comments.length.toString()).subscribe((res) => {
      this.comments = res.data;
    });
  }

  submit() {
    if (this.isFromEdit) {
      this.isSubmitted = true;
      if (this.commentForm.invalid) return;

      this.action = 'Edit';
      this.edit();
    }
    else {
      this.isSubmitted = true;
      if (this.commentForm.invalid) return;


      this.action = 'Create';
      this.create();

    }
  }

  create() {

    this.commentService.addComment(this.bookId, this.commentForm.value).subscribe((res) => {

      this.comments.unshift(res.data);
      this.commentForm.reset();
      this.toastrService.success(
        `Comment is created!`,
        'Success'
      )

    },
      (err) => {
        this.toastrService.error(
          err.error.message,
          'Comment creation Failed'
        )
      }
    );
  }

  edit() {
    this.commentService.editComment(this.lastEditId, this.commentForm.value).subscribe((res) => {
      for (const c of this.comments) {
        if (c._id === this.lastEditId) {
          c.comment = this.commentForm.value.comment;


          break;
        }
      }



      this.comments.unshift(res.data);
      this.commentForm.reset();
      this.toastrService.success(
        `Comment is edited!`,
        'Success'
      )
      timer(1000)
        .toPromise()
        .then(() => {
          window.location.reload();
        });
    },
      (err) => {
        this.toastrService.error(
          err.error.message,
          'Comment editing Failed'
        )
      }

    )


  }

  editComment(id: any, content: any) {

    const editedContent = this.commentForm.value.comment;

    this.isFromEdit = true;
    this.lastEditId = id;
    this.commentForm.patchValue({ comment: content });
    alert(`editComment ${id} ${content}`);

  }

  removeComment(id: any, content: any) {

    this.lastDeleteId = id;
    const delId = this.lastDeleteId;
    const state = confirm(`Are you sure you want to delete this comment ${delId} ${content}`)


    if (state) {
      this.commentService.deleteComment(this.lastDeleteId).subscribe(() => {

        this.comments = this.comments.filter(c => c._id !== delId);
        this.toastrService.success(
          `Comment is deleted!`,
          'Success'
        )
      },
        (err) => {
          this.toastrService.error(
            err.error.message,
            'Comment deleting Failed'
          )
        }

      )
    }

  }

  loadMoreComments() {
    this.commentService.getComments(this.bookId, this.comments.length.toString()).subscribe((res) => {
      if (res.data.length !== 0) {
        this.comments.splice(this.comments.length, 0, ...res.data);
      }
    });
  }

  navigateToProfile(username: string) {
    this.router.navigateByUrl(`/user/profile/${username}`)
  }

}
