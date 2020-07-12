import { Injectable } from '@angular/core';
import { Post } from '../interfaces/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];

  getPosts = () => {
    // return [...this.posts]; // to prevent original array from modifying
    return this.posts;
  }

  addPost = (title: string, content: string) => {
    const POST: Post = {title: title, content: content};
    this.posts.push(POST);
  }
}
