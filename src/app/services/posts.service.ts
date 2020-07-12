import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Post } from '../interfaces/post.model';


@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  getPosts = () => [...this.posts];

  getPostUpdateListener = () => this.postsUpdated.asObservable();

  addPost = (title: string, content: string) => {
    const POST: Post = {title: title, content: content};
    this.posts.push(POST);
    this.postsUpdated.next([...this.posts]);
  }
}
