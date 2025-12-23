import { Component, inject, signal } from '@angular/core';
import { Sidebar } from '../../../../shared/components/Sidebar/sidebar';
import { PostService } from '../../services/post-service';
import { PostResponse } from '../../interfaces/PostResponse';
import { PostBlog } from '../../components/post-blog/post-blog';
import { PostList } from '../../components/post-list/post-list';
import { FormPost } from '../../components/form-post/form-post';

@Component({
  selector: 'app-dashboard',
  imports: [Sidebar, PostBlog, PostList, FormPost],
  templateUrl: './dashboard.html',
})
export default class Dashboard {
  postService = inject(PostService)
  posts = signal<PostResponse[]>([]);
  isLoading = false;
  expandirPost = signal(false)
  idPost = signal('')
  screen = signal(1)

  showAllPosts() {
    this.screen.set(1)
  }

  showOnePost(id: string) {
    this.idPost.set(id)
    this.screen.set(2)
  }

  showForm() {
    this.screen.set(3)
  }
  updateForm(id: string) {
    this.screen.set(3)
    this.idPost.set(id)
  }

}
