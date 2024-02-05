import {Component} from '@angular/core';
import {Post} from "./post-list/post-list.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  storedPosts: Post[] = [
    {id: 1, title: 'First Post', content: `First's post Content`},
  ]

  constructor() {
  }
  onPostEdit(post: Post): void {
    this.storedPosts.push(post)
  }

}
