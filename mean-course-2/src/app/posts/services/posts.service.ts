import {Injectable} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {map, Observable, Subject} from "rxjs";
import {HttpClient, HttpParams} from "@angular/common/http";
import {PostResponseDto} from "../dto/postResponse.dto";
import {PostModel} from "../models/post.model";

const BASE_URI: string = 'http://localhost:3000'
const POST_ENDPOINT: string = '/api/posts'

interface PostResponseModel {
  message: string,
  post: PostResponseDto
}

interface GetResponseModel {
  message: string,
  posts: PostResponseDto[],
  maxPosts: number
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private postsUpdated: Subject<{ posts: PostModel[], postCount: number }> = new Subject<{
    posts: PostModel[],
    postCount: number
  }>()

  constructor(
    private http: HttpClient
  ) {
  }

  getPosts(pageSize: number, page: number): void {
    const options: { params: HttpParams } = {
      params: new HttpParams()
        .set('pageSize', pageSize)
        .append('page', page)
    }

    this.http.get<GetResponseModel>(BASE_URI + POST_ENDPOINT, options)
      .pipe(
        map((responseData: GetResponseModel): {
          post: PostModel[], maxPosts: number
        } => {
          return {
            post: responseData.posts.map((post: PostResponseDto): PostModel => {
              return {
                id: post._id as string,
                title: post.title as string,
                content: post.content as string,
                image: post.imagePath
              }
            }),
            maxPosts: responseData.maxPosts
          }
        })
      )
      .subscribe((transformedData: { post: PostModel[], maxPosts: number }): void => {
        this.postsUpdated.next({posts: [...transformedData.post], postCount: transformedData.maxPosts})
      })
  }

  getPost(id: string): Observable<PostResponseDto> {
    return this.http.get<PostResponseDto>(BASE_URI + POST_ENDPOINT + `/${id}`)
  }

  addPost(title: string, content: string, image: File): void {
    const postData: FormData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<PostResponseModel>(BASE_URI + POST_ENDPOINT, postData).subscribe()
  }

  updatePost(
    id: string,
    title: string,
    content: string,
    image: File | string
  ): void {
    let postData: FormData | Post;
    if (typeof image === 'object') {
      postData = new FormData()
      postData.append('id', id)
      postData.append('title', title)
      postData.append('content', content)
      postData.append('image', image, title)
    } else {
      postData = {id, title, content, imagePath: image}
    }

    this.http.put<PostResponseModel>(BASE_URI + POST_ENDPOINT + `/${id}`, postData)
      .subscribe()
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(BASE_URI + POST_ENDPOINT + `/${postId}`)
  }

  getPostUpdateListener(): Observable<{ posts: PostModel[], postCount: number }> {
    return this.postsUpdated.asObservable()
  }
}
