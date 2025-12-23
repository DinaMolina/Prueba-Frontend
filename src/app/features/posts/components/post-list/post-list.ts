import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { PostResponse } from '../../interfaces/PostResponse';
import { PostService } from '../../services/post-service';
import { DatePipe, SlicePipe } from '@angular/common';

@Component({
  selector: 'app-post-list',
  imports: [DatePipe, SlicePipe],
  templateUrl: './post-list.html',
})
export class PostList {
  @Output() postSelected = new EventEmitter()
  @Output() updatePost = new EventEmitter()
  postService = inject(PostService)
  posts = signal<PostResponse[]>([]);
  isLoading = false;
  expandirPost = signal(false)
  idPost = signal('')

  ngOnInit() {
    this.cargarPosts()
  }

  cargarPosts() {
    this.isLoading = true;
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        this.posts.set(data);
        this.isLoading = false;
      },
      error: () => this.isLoading = false
    });
  }
  verPost(id: string) {
    this.idPost.set(id)
    this.postSelected.emit(this.idPost())
  }
  editarPost(id: string) {
    this.idPost.set(id)
    this.updatePost.emit(this.idPost())
  }
  eliminar(id: string) {
    this.postService.deletePost(id).subscribe((success) => {
      if (success) {
        this.cargarPosts()
      }
    });
  }

}
