import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PageMode } from '../enums/PageMode';
import { Post } from '../interfaces/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = PageMode.CreatePost;
  private postId:string = undefined;
  post: Post

  constructor(
    private postsService: PostsService,
    public activatedRoute: ActivatedRoute
    ) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = PageMode.EditPost;
        this.postId = paramMap.get('postId');
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.post = { id: postData._id, title: postData.title, content: postData.content };
        })
      } else {
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if(form.invalid)
      return;
    if(this.mode == PageMode.CreatePost) {
      this.postsService.addPost(form.value.title, form.value.content);
    } else {
      this.postsService.updatePost(
        this.postId,
        form.value.title,
        form.value.content);
    }
    form.resetForm();
  }
}
