import {Component, OnInit} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../services/posts.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {mimeTypeValidator} from "./mime-type.validator";
import {MessageService} from "primeng/api";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {
  post!: Post
  isLoading: boolean = false
  imagePreview!: string

  form!: FormGroup
  private mode = 'create'
  private postId!: string | null

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService:MessageService
  ) {
  }

  ngOnInit(): void {
    this.showError('test')

    this.form = new FormGroup<any>({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      }),
    })


    this.route.paramMap.subscribe((paramMap: ParamMap): void => {
      if (paramMap.has('postId')) {
        this.mode = 'edit'
        this.postId = paramMap.get('postId') as string
        this.isLoading = true

        this.postsService.getPost(this.postId).subscribe((responsePost: Post): void => {
          this.isLoading = false
          this.post = {
            id: responsePost.id,
            title: responsePost.title,
            content: responsePost.content
          }

          this.form.setValue({
            title: this.post.title,
            content: this.post.content
          })

        })
      } else {
        this.mode = 'create'
        this.postId = null
      }
    })

  }

  onSavePost(): void {
    if (this.form.invalid) {
      return;
    }
    const createdPost: Post = {
      title: this.form.value.title,
      content: this.form.value.content
    }
    this.isLoading = true
    this.mode === "create" ?
      this.postsService.addPost(createdPost) :
      this.postsService.updatePost(this.postId as string, createdPost.title, createdPost.content)
    this.router.navigate(['../'])
    this.form.reset()
  }

  onImagePick(event: Event): void {
    // @ts-ignore
    const file: File = (event.target as HTMLInputElement).files[0]
    this.form.patchValue({image: file})
    this.form.get('image')?.updateValueAndValidity()

    const reader: FileReader = new FileReader()
    reader.onload = (): void => {
      this.imagePreview = reader.result as string
      if (this.form.get('image')?.hasError('invalidMimeType')){
        this.showError('test')
      }
    }
    reader.readAsDataURL(file)
  }

  showError(msgContent:string):void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: msgContent });
  }


}
