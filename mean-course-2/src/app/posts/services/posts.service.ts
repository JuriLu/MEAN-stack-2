import {Injectable} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {map, Observable, Subject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {PostResponseDto} from "../dto/postResponse.dto";

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

    getPost(id: string): Observable<Post> {
        return this.http.get<Post>(BASE_URI + POST_ENDPOINT + `/${id}`)
    }

    addPost(inPost: Partial<Post>): void {
        const post: Post = {
            id: null,
            title: inPost.title as string,
            content: inPost.content as string
        }
        this.http.post<PostResponseDto>(BASE_URI + POST_ENDPOINT, post).subscribe(
            (responseData: PostResponseDto): void => {
                post.id = responseData.postId
                this.posts.push(post)
                this.postsUpdated.next([...this.posts])
            }
        )

    }

    updatePost(id: string, title: string, content: string): void {
        const post: Post = {id, title, content}
        this.http.put(BASE_URI + POST_ENDPOINT + `/${id}`, post)
            .subscribe(response => {
                //? const updatedPosts = [...this.posts];
                //? const oldPostIndex = updatedPosts.findIndex(p=>p.id === id)
                //? updatedPosts[oldPostIndex] = post
                //? this.posts = updatedPosts
                //? this.postsUpdated.next([...this.posts])
            })
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
