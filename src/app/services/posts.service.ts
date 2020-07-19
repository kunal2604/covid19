import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
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
    this.httpClient.get<{message:string, posts: any}>(URL)
      .pipe(map((postData) => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id
          }
        })
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListener = () => this.postsUpdated.asObservable();

  addPost = (title: string, content: string) => {
    const POST: Post = {id:null, title: title, content: content};
    const URL = URLS.ADD_POST;
    this.httpClient
      .post<{ message: string, postId: string }>(URL, POST)
      .subscribe(response => {
        POST.id = response.postId;
        this.posts.push(POST);
        this.postsUpdated.next([...this.posts]);
      });
  }

  deletePost(postId: string) {
    const URL = URLS.DELETE_POST + postId;
    this.httpClient
      .delete(URL)
      .subscribe(() => {
        const UPDATED_POSTS = this.posts.filter(post => post.id !== postId);
        this.posts = UPDATED_POSTS;
        this.postsUpdated.next([...UPDATED_POSTS]);
      });
  }
}
