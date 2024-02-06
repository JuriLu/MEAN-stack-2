import {Component} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {NgForm} from "@angular/forms";
import {PostsService} from "../services/posts.service";

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {
  newPost!: string
  enteredTitle: string = ''
  enteredContent: string = ''

  constructor(
    private postsService: PostsService
  ) {
  }

  onAddPost(form: NgForm): void {
    if (form.invalid) {
      return;
    }
    const createdPost: Post = {
      title: form.value.title,
      content: form.value.content
    }
    this.postsService.addPost(createdPost)
    form.resetForm()
  }
}
