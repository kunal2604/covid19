import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../interfaces/post.model';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost = (form: NgForm) => {
    if(form.invalid)
      return;
    const POST: Post = {
      title: form.value.title,
      content: form.value.content
    };
    this.postCreated.emit(POST);
  }
}
