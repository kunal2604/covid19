import { Component, EventEmitter, Output } from '@angular/core';
import { Post } from '../interfaces/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent {
  enteredTitle: string = '';
  enteredContent: string = '';
  @Output() postCreated = new EventEmitter<Post>();

  onAddPost = () => {
    const POST: Post = {title: this.enteredTitle, content: this.enteredContent}
    this.postCreated.emit(POST);
  }
}
