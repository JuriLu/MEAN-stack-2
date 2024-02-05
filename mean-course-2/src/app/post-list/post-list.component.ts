import {Component, Input} from '@angular/core';

export interface Post {
  title: string;
  content: string
  id?: number;
}

// posts: Posts[] = [
//   {id: 1, title: 'First Post', content: `First's post Content`},
//   {id: 2, title: 'Second Post', content: `Second's post Content`},
//   {id: 3, title: 'Third Post', content: `Third's post Content`}
// ]

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {

  posts: Post[] = []

  @Input() set postsInputResponse(postResponse: Post[]) {
    if (postResponse) {
      this.posts = postResponse
    }
  }
}
