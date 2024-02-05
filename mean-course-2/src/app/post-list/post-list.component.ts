import {Component} from '@angular/core';

interface Posts {
  title: string;
  content: string
}

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  posts: Posts[] = [
    {title: 'First Post', content: `First's post Content`},
    {title: 'Second Post', content: `Second's post Content`},
    {title: 'Third Post', content: `Third's post Content`}
  ]
}
