import {Injectable} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PostResponseDto} from "../dto/postResponse.dto";
import {PostModel} from "../models/post.model";

const BASE_URI: string = 'http://localhost:3000'
const POST_ENDPOINT: string = '/api/posts'

interface ResponseModel {
  message: string,
  post: PostResponseDto
}

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: PostModel[] = []
  private postsUpdated: Subject<PostModel[]> = new Subject<PostModel[]>()

  constructor(
    private http: HttpClient
  ) {
  }

  getPosts(): void {
    this.http.get<PostResponseDto[]>(BASE_URI + POST_ENDPOINT)
      .pipe(
        map((postsData: PostResponseDto[]) => {
          return postsData.map((post: PostResponseDto): PostModel => {
            return {
              id: post._id as string,
              title: post.title as string,
              content: post.content as string,
              image: post.imagePath
            }
          })
        })
      )
      .subscribe((postData: PostModel[]): void => {
        this.postsUpdated.next([...postData])
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

    this.http.post<ResponseModel>(BASE_URI + POST_ENDPOINT, postData).subscribe(
      (responseData: ResponseModel): void => {
        const post: PostModel = {
          id: responseData.post._id,
          title: responseData.post.title,
          content: responseData.post.content,
          image: responseData.post.imagePath
        }
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
      }
    )

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

    this.http.put<ResponseModel>(BASE_URI + POST_ENDPOINT + `/${id}`, postData)
      .subscribe(
        (response: ResponseModel): void => {
          this.reloadUpdatedPost(response.post, id)
        })
  }

  reloadUpdatedPost(postResponseDto: PostResponseDto, id: string): void {
    const toBeUpdatedPosts: PostModel[] = [...this.posts];
    const oldPostIndex: number = toBeUpdatedPosts.findIndex((p: PostModel): boolean => p.id === id)
    toBeUpdatedPosts[oldPostIndex] = {
      id: postResponseDto._id,
      title: postResponseDto.title,
      content: postResponseDto.content,
      image: postResponseDto.imagePath,
    }
    this.posts = toBeUpdatedPosts
    this.postsUpdated.next([...this.posts])
  }

  deletePost(postId: string): void {
    this.http.delete(BASE_URI + POST_ENDPOINT + `/${postId}`)
      .subscribe((): void => {
          this.posts = this.posts.filter((post: PostModel): boolean => post.id !== postId)
          this.postsUpdated.next([...this.posts])
        }
      )
  }

  getPostUpdateListener(): Observable<PostModel[]> {
    return this.postsUpdated.asObservable()
  }
}
