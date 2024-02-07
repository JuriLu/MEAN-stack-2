import {Component, OnInit} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {NgForm} from "@angular/forms";
import {PostsService} from "../services/posts.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {
    newPost!: string
    private mode = 'create'
    private postId!: string | null
    post: any

    constructor(
        private postsService: PostsService,
        private route: ActivatedRoute,
        private router:Router
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap: ParamMap): void => {
                if (paramMap.has('postId')) {
                    this.mode = 'edit'
                    this.postId = paramMap.get('postId') as string
                    this.post = this.postsService.getPost(this.postId)
                } else {
                    this.mode = 'create'
                    this.postId = null
                }
            }
        )
    }

    onSavePost(form: NgForm): void {
        if (form.invalid) {
            return;
        }
        const createdPost: Post = {title: form.value.title, content: form.value.content}

        this.mode === "create" ?
            this.postsService.addPost(createdPost) :
            this.postsService.updatePost(this.postId as string, createdPost.title, createdPost.content)

        this.router.navigate(['../'])
        form.resetForm()
    }


}
