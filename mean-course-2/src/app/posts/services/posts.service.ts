import {Injectable} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  private posts: Post[] = [
    {id: 1, title: 'First Post', content: `First's post Content`},
  ]
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>()

  constructor(
    private http: HttpClient
  ) {
  }

  getPosts(): void {
    this.http.get<Post[]>('http://localhost:3000/api/posts')
      .subscribe((postData: Post[]): void => {
        this.posts = postData
        this.postsUpdated.next([...this.posts])
      })
  }

  getPostUpdateListener(): Observable<Post[]> {
    return this.postsUpdated.asObservable()
  }

  addPost(inPost: Partial<Post>): void {
    const post: Post = {
      title: inPost.title as string,
      content: inPost.content as string
    }
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post).subscribe(
      (responseData: { message: string }): void => {
        console.log(responseData.message)
        this.posts.push(post)
        this.postsUpdated.next([...this.posts])
      }
    )

  }
}
