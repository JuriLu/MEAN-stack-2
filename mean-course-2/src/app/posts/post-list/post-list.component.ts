import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {PostsService} from "../services/posts.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = []
  private postsSub!: Subscription

  constructor(
    private postsService: PostsService
  ) {
  }

  ngOnInit(): void {
    this.getPostsAndUpdate()
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe()
  }

  getPostsAndUpdate(): void {
    this.postsService.getPosts()
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (posts: Post[]): void => {
        this.posts = posts
      }
    )
  }

  onDelete(id: string): void {
    this.postsService.deletePost(id)
    // this.getPostsAndUpdate()
  }

}
