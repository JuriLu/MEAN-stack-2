import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {PostsService} from "../../services/posts.service";
import {Subscription} from "rxjs";
import {PostModel} from "../../models/post.model";
import {MatPaginator, PageEvent} from "@angular/material/paginator";

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: PostModel[] = []
  private postsSub!: Subscription
  isLoading: boolean = false

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //* Pagination Feature
  totalPosts: number = 100
  postPerPage: number = 5
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
    this.postsService.getPosts(this.postPerPage, this.currentPage)
    this.postsSub = this.postsService.getPostUpdateListener().subscribe(
      (postData: { posts: PostModel[], postCount: number }): void => {
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

    this.currentPage = pageData.pageIndex + 1; //* Its index , it starts from 0
    this.postPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postPerPage, this.currentPage)
  }

}
