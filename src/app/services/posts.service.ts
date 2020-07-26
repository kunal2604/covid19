import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from '../interfaces/post.model';
import { URLS } from '../urls';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
    ) {
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

  addPost = (title: string, content: string, image: File) => {
    const URL = URLS.ADD_POST;
    const POST_DATA = new FormData();
    POST_DATA.append('title', title);
    POST_DATA.append('content', content);
    POST_DATA.append('image', image, title);
    this.httpClient
      .post<{ message: string, postId: string }>(URL, POST_DATA)
      .subscribe(response => {
        const POST: Post = {
          id: response.postId,
          title: title,
          content: content
        };
        this.posts.push(POST);
        this.postsUpdated.next([...this.posts]);
        this.commonService.navigateToHome();
      });
  }

  getPost(id: string) {
    const URL = URLS.GET_POST + id;
    return this.httpClient.get<{ _id: string, title:string, content: string }>(URL);
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

  updatePost(id: string, title: string, content: string) {
    const POST: Post = { id, title, content };
    const URL = URLS.UPDATE_POST + id;
    this.httpClient.put(URL, POST)
      .subscribe(response => {
        const UPDATED_POST = [...this.posts];
        const OLD_POST_INDEX = UPDATED_POST.findIndex(p => p.id === id);
        UPDATED_POST[OLD_POST_INDEX] = POST;
        this.posts = UPDATED_POST;
        this.postsUpdated.next([...this.posts]);
        this.commonService.navigateToHome();
      });
  }
}
