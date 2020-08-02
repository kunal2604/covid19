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
  private postsUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(
    private httpClient: HttpClient,
    private commonService: CommonService
    ) {
  }

  getPosts = (postsPerPage: number, currentPage: number) => {
    const QUERY_PARAMS = `?pagesize=${postsPerPage}&page=${currentPage}`;
    const URL = URLS.GET_POSTS + QUERY_PARAMS;
    this.httpClient.get<{message:string, posts: any, maxPosts: number}>(URL)
      .pipe(map((postData) => {
        return {posts: postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        }), maxPosts: postData.maxPosts};
      }))
      .subscribe((transformedPostData) => {
        this.posts = transformedPostData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postCount: transformedPostData.maxPosts
        });
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
      .post<{ message: string, post: Post }>(URL, POST_DATA)
      .subscribe(response => {
        this.commonService.navigateToHome();
      });
  }

  getPost(id: string) {
    const URL = URLS.GET_POST + id;
    return this.httpClient.get<{ _id: string, title:string, content: string, imagePath: string }>(URL);
  }

  deletePost(postId: string) {
    const URL = URLS.DELETE_POST + postId;
    return this.httpClient.delete(URL)
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if(typeof(image) === 'object') {  // image was also updated ; typeof(file) =  object (File)
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {       // image not updated, typeof(file) != object (string is not object)
      postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image // string
      }
    }
    const URL = URLS.UPDATE_POST + id;
    this.httpClient.put(URL, postData)
      .subscribe(response => {
        this.commonService.navigateToHome();
      });
  }
}
