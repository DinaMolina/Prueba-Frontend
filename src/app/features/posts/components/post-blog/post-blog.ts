import { PostResponse } from './../../interfaces/PostResponse';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { PostService } from '../../services/post-service';
import { DatePipe } from '@angular/common';
import { CommentResponse } from '../../interfaces/CommentResponse';
import { CommentService } from '../../services/comment-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../core/utils/FormUtils';

@Component({
  selector: 'app-post-blog',
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './post-blog.html',
})
export class PostBlog {
  @Input() idPost: string = '';
  @Output() back = new EventEmitter()
  postService = inject(PostService)
  commentService = inject(CommentService)
  post = signal<PostResponse>({} as PostResponse);
  comments = signal<CommentResponse[]>([]);
  isLoading = false;
  formUtils = FormUtils;
  fb = inject(FormBuilder)
  commentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    email: ['', [Validators.required, Validators.email]],
    body: ['', [Validators.required, Validators.minLength(10)]],
  })


  ngOnInit() {
    this.getPosts()
    this.getComments()
  }
  getPosts() {
    this.isLoading = true;
    this.postService.getOnePosts(this.idPost).subscribe({
      next: (data) => {
        this.post.set(data);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  backAllPost() {
    this.back.emit()
  }
  getComments() {
    this.isLoading = true;
    this.commentService.getComments(this.idPost).subscribe({
      next: (data) => {
        this.comments.set(data);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  crearComment() {
    if (this.commentForm.valid) {
      const data = {
        postId: this.idPost,
        ...this.commentForm.value
      };
      this.commentService.createComment(this.idPost, data).subscribe((res) => {
        if (res) {
          this.getComments()
          this.commentForm.reset();
        }
      });
    }


  }

}
