import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../interfaces/post.model';
import { URLS } from '../urls';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(private httpClient: HttpClient) {
  }

  getPosts = () => {
    const URL = URLS.GET_POSTS;
    this.httpClient.get<{message:string, posts: Post[]}>(URL)
      .subscribe((postsData) => {
        this.posts = postsData.posts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener = () => this.postsUpdated.asObservable();

  addPost = (title: string, content: string) => {
    const POST: Post = {id:null, title: title, content: content};
    console.log('POST -> ', POST);
    const URL = URLS.ADD_POST;
    this.httpClient
      .post<{ message: string }>(URL, POST)
      .subscribe(response => {
        this.posts.push(POST);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
