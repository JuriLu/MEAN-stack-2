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
        this.http.get<Post[]>('http://localhost:3000/api/posts')
            .pipe(
                map((postsData: Post[]) => {
                    return postsData.map((post: any) => {
                        return {
                            title: post.title,
                            content: post.content,
                            id: post._id
                        }
                    })
                })
            )
            .subscribe((postData: Post[]): void => {
                this.posts = postData
                this.postsUpdated.next([...this.posts])
            })
    }

    addPost(inPost: Partial<Post>): void {
        const post: Post = {
            title: inPost.title as string,
            content: inPost.content as string
        }
        this.http.post<{ message: string }>(BASE_URI + POST_ENDPOINT, post).subscribe(
            (responseData: { message: string }): void => {
                console.log(responseData.message)
                this.posts.push(post)
                this.postsUpdated.next([...this.posts])
            }
        )

    }

    deletePost(postId: string): void {
        this.http.delete(`http://localhost:3000/api/posts/${postId}`)
            .subscribe((): void => {
                    const updatedPosts: Post[] = this.posts.filter(post => post.id !== postId)
                    this.posts = updatedPosts
                    this.postsUpdated.next([...this.posts])

                }
            )
    }

    getPostUpdateListener(): Observable<Post[]> {
        return this.postsUpdated.asObservable()
    }


}
