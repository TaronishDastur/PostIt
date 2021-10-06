import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Post } from '../shared/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private postsList: Post[] = [];
  private posts$ = new Subject<Post[]>();
  private postsLength$ = new Subject<number>();
  private url = environment.serverUrl + '/posts';
  constructor(private httpClient: HttpClient, private router: Router) {}

  retrievePosts(pageSize: number, pageNumber: number) {
    const queryParams = `?pageSize=${pageSize}&pageNumber=${pageNumber}`;
    this.httpClient
      .get<{ message: string; posts: any[]; length: number }>(
        this.url + queryParams
      )
      .pipe(
        tap((res) => this.postsLength$.next(res.length)),
        map((data) =>
          data.posts.map((post) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              image: post.image,
              createdBy: post.createdBy,
            };
          })
        )
      )
      .subscribe((postsData: Post[]) => {
        this.postsList = postsData;
        this.posts$.next([...this.postsList]);
      });
  }
  getPosts() {
    return this.posts$.asObservable();
  }

  getPostLength() {
    return this.postsLength$.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    let formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('image', image);
    this.httpClient
      .post<{ message: string; post: Post }>(this.url, formData)
      .subscribe((data) => {
        const post = { ...data.post };
        this.postsList.push(post);
        this.posts$.next(this.postsList);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.httpClient.delete(this.url + '/' + id);
  }

  updatePost(id: string, title: string, content: string, image) {
    let postData;
    if (!!image) {
      postData = { title: title, content: content, image: image, id: id };
    } else {
      postData = { title: title, content: content, id: id };
    }
    this.httpClient.put(this.url + '/' + id, postData).subscribe((res) => {
      this.postsList[this.postsList.findIndex((post) => post.id === id)] =
        new Post(title, content, image, id);
      this.posts$.next(this.postsList);
      this.router.navigate(['/']);
    });
  }
  // TODO - understand why http call is required here and not directly accessing the list
  getPostById(id: string) {
    return this.httpClient.get<{
      message: String;
      post: { _id: string; content: string; title: string; image: string };
    }>(this.url + '/' + id);
  }
}
