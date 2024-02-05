import {Component} from '@angular/core';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent {
  newPost!:string
  enteredValue:string = "NO VALUE"
  constructor() {
  }

  onAddPost(): void {
    this.newPost = this.enteredValue
  }
}
