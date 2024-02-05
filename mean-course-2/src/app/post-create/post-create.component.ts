import {Component, EventEmitter, Output} from '@angular/core';
import {Post} from "../post-list/post-list.component";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {
  newPost!: string
  enteredTitle: string = ''
  enteredContent: string = ''

  @Output() postCreatedEvent:EventEmitter<Post> = new EventEmitter()
  constructor() {
  }

  onAddPost(): void {
    const createdPost: Post = {
      title: this.enteredTitle,
      content: this.enteredContent
    }
    this.postCreatedEvent.emit(createdPost)
  }
}
