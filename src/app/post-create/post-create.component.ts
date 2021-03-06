import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../services/posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PageMode } from '../enums/PageMode';
import { Post } from '../interfaces/post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  private mode = PageMode.CreatePost;
  private postId:string = undefined;
  post: Post
  isLoading:boolean = false;
  form: FormGroup;
  imagePreview: string;

  constructor(
    private postsService: PostsService,
    public activatedRoute: ActivatedRoute
    ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(10)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = PageMode.EditPost;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            imagePath: postData.imagePath
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            image: this.post.imagePath,
          });
        })
      } else {
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if(this.form.invalid)  // If file is not image, then stop
      return;
    this.isLoading = true;
    if(this.mode == PageMode.CreatePost) {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePicked(event: Event) {
    const FILE = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      image: FILE
    });
    this.form.get('image').updateValueAndValidity();
    const FILE_READER = new FileReader();
    FILE_READER.onload = () => {
      this.imagePreview = FILE_READER.result as string;
    }
    FILE_READER.readAsDataURL(FILE);
  }
}
