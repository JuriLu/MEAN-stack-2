import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostsService} from "../../services/posts.service";
import {Subscription} from "rxjs";
import {PostModel} from "../../models/post.model";
import {PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: PostModel[] = []
  private postsSub!: Subscription
  isLoading: boolean = false

  //* Pagination Feature
  totalPosts: number = 0
  postPerPage: number = 10
  pageSizeOptions: number[] = [1, 2, 4, 10]
  currentPage: number = 1

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
    this.isLoading = true
    this.postsService.getPosts(this.postPerPage, 1)
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (postData: { posts: PostModel[], postCount: number }): void => {
        console.log(postData.postCount)
        this.isLoading = false
        this.totalPosts = postData.postCount
        this.posts = postData.posts
      }
    )
  }

  onDelete(id: string): void {
    this.isLoading = true
    this.postsService.deletePost(id).subscribe(
      (): void => {
        this.postsService.getPosts(this.postPerPage, this.currentPage)
      }
    )
  }

  onChangedPage(pageData: PageEvent): void {
    this.isLoading = true
    this.currentPage = pageData.pageIndex + 1; //* Its index , it starts from 0
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage)
  }

}
