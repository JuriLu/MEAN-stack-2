import {Injectable} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

const BASE_URI: string = 'http://localhost:3000'
const POST_ENDPOINT: string = '/api/posts'

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = []
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>()

  constructor(
    private http: HttpClient
  ) {
  }

  getPosts(): void {
    this.http.get<Post[]>(BASE_URI + POST_ENDPOINT)
      .pipe(
        map((postsData: Post[]) => {
          return postsData.map((post: any): Post => {
            return {
              id: post._id as string,
              title: post.title as string,
              content: post.content as string,
              imagePath: post.imagePath
            }
          })
        })
      )
      .subscribe((postData: Post[]): void => {
        this.posts = postData
        this.postsUpdated.next([...this.posts])
      })
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(BASE_URI + POST_ENDPOINT + `/${id}`)
  }

  addPost(title: string, content: string, image: File): void {
    const postData: FormData = new FormData()
    postData.append('title', title)
    postData.append('content', content)
    postData.append('image', image, title)

    this.http.post<any>(BASE_URI + POST_ENDPOINT, postData).subscribe(
      (responseData: { message: string, post: Post }): void => {
        const post: Post = {
          id: responseData.post.id,
          title: responseData.post.title,
          content: responseData.post.content,
          imagePath: responseData.post.imagePath
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
    console.log('Service, updatePost() , image',image)
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

    this.http.put<{ message: string,imagePath:any }>(BASE_URI + POST_ENDPOINT + `/${id}`, postData)
      .subscribe(
        (response: { message: string ,imagePath:any}): void => {
          const updatedPosts: Post[] = [...this.posts];
          const oldPostIndex: number = updatedPosts.findIndex((p: Post): boolean => p.id === id)
          updatedPosts[oldPostIndex] = {
            id: id,
            title: title,
            content: content,
            imagePath: response.imagePath,
          }
          this.posts = updatedPosts
          this.postsUpdated.next([...this.posts])        })
  }

  reloadUpdatedPost(postData: Post, id: string): void {
    const updatedPosts: Post[] = [...this.posts];
    const oldPostIndex: number = updatedPosts.findIndex((p: Post): boolean => p.id === id)
    updatedPosts[oldPostIndex] = {
      id: postData.id,
      title: postData.title,
      content: postData.content,
      imagePath: postData.imagePath,
    }
    this.posts = updatedPosts
    this.postsUpdated.next([...this.posts])
  }

  deletePost(postId: string): void {
    this.http.delete(BASE_URI + POST_ENDPOINT + `/${postId}`)
      .subscribe((): void => {
          this.posts = this.posts.filter(post => post.id !== postId)
          this.postsUpdated.next([...this.posts])
        }
      )
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable()
  }
}
