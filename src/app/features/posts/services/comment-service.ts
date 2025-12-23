import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { delay, retry, catchError, of } from 'rxjs';
import { CommentResponse } from '../interfaces/CommentResponse';


@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient)
  private url = `${environment.urlApi}/comments`;
  getComments(idPost: string) {
    return this.http.get<CommentResponse[]>(this.url + `/posts/${idPost}`).pipe(
      delay(1000),
      retry(2),
      catchError((error) => {
        console.error('Error en la petición:', error);
        return of([]);
      })
    )
  }
  createComment(idPost:string, newPost: Partial<CommentResponse>) {
    return this.http.post<CommentResponse>(this.url + `/posts/${idPost}`, newPost).pipe(
      retry(1),
      catchError((error) => {
        console.error('Error al crear:', error);
        return of(null);
      })
    );
  }

}
