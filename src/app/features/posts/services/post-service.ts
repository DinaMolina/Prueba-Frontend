import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PostResponse } from '../interfaces/PostResponse';
import { catchError, delay, retry, tap, of, throwError, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient)
  private url = `${environment.urlApi}/posts`;


  getAllPosts() {
    return this.http.get<PostResponse[]>(this.url).pipe(
      delay(1000),
      retry(2),
      catchError((error) => {
        console.error('Error en la petición:', error);
        return of([]);
      })
    );
  }
  getOnePosts(id: string) {
    return this.http.get<PostResponse>(this.url + `/${id}`).pipe(
      delay(1000),
      retry(2),
      catchError((error) => {
        console.error('Error en la petición:', error);
        return of({} as PostResponse);
      })
    )
  }
  createPost(newPost: Partial<PostResponse>){
    return this.http.post<PostResponse>(this.url, newPost).pipe(
      retry(1),
      catchError((error) => {
        console.error('Error al crear:', error);
        return of(null);
      })
    );
  }


  updatePost(id: string, changes: Partial<PostResponse>) {
    return this.http.patch<PostResponse>(`${this.url}/${id}`, changes).pipe(
      retry(1),
      catchError((error) => {
        console.error('Error al actualizar:', error);
        return of(null);
      })
    );
  }


  deletePost(id: string) {
    return this.http.delete<void>(`${this.url}/${id}`).pipe(
      map(() => true),
      catchError((error) => {
        console.error('Error al eliminar:', error);
        return of(false);
      })
    );
  }
}
