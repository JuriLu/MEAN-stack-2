import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from "../../interfaces/post.interface";
import {PostsService} from "../../services/posts.service";
import {Subscription} from "rxjs";
import {PostModel} from "../../models/post.model";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: PostModel[] = []
  private postsSub!: Subscription
  isLoading: boolean = false

  constructor(
    private postsService: PostsService
  ) {
  }

  ngOnInit(): void {
    this.isLoading = true
    this.getPostsAndUpdate()
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe()
  }

  getPostsAndUpdate(): void {
    this.postsService.getPosts()
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (posts: PostModel[]): void => {
        this.isLoading = false
        this.posts = posts
      }
    )
  }

  onDelete(id: string): void {
    this.postsService.deletePost(id)
  }

}
