import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormUtils } from '../../../../core/utils/FormUtils';
import { PostResponse } from '../../interfaces/PostResponse';
import { PostService } from '../../services/post-service';

@Component({
  selector: 'app-form-post',
  imports: [ReactiveFormsModule],
  templateUrl: './form-post.html',
})
export class FormPost {
  @Input() idPost: string = '';
  @Output() back = new EventEmitter()
  formUtils = FormUtils;
  fb = inject(FormBuilder)

  postForm: FormGroup = this.fb.group({
    author: ['', [Validators.required, Validators.minLength(5)]],
    title: ['', [Validators.required, Validators.minLength(3)]],
    body: ['', [Validators.required, Validators.minLength(10)]]
  })
  postService = inject(PostService)
  post = signal<PostResponse>({} as PostResponse);
  isLoading = false;

  ngOnInit() {
    if (this.idPost.length > 0) {
      this.renderizarPost()
    }

  }
  renderizarPost() {
    this.isLoading = true;
    this.postService.getOnePosts(this.idPost).subscribe({
      next: (data) => {
        this.post.set(data);
        this.postForm.setValue({
          author: this.post().author,
          title: this.post().title,
          body: this.post().body
        });
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  backAllPost() {
    this.back.emit()
  }
  onSave() {
    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    if (this.idPost.length > 0) {
      this.actualizarPost(this.idPost)
    } else {
      this.crear()
    }


  }
  crear() {
    this.postService.createPost(this.postForm.value).subscribe((res) => {
      if (res) {
        this.backAllPost()
      }
    });
  }
  actualizarPost(id: string) {


    this.postService.updatePost(id, this.postForm.value).subscribe({
      next: (postActualizado) => {
        if (postActualizado) {

          this.backAllPost()
        }
      }
    });
  }

}


