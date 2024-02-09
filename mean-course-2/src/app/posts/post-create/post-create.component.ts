import {Component, OnInit} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
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
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.definingForm()
    this.definingCreateOrEditMode()
  }

  definingForm(): void {
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
  }

  //TODO: Might turn into a Resolver
  definingCreateOrEditMode(): void {
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
            content: responsePost.content,
            imagePath: ''

            // image:responsePost.image
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

    // const createdPost: Post = {
    //   title: this.form.value.title,
    //   content: this.form.value.content,
    // }

    this.isLoading = true
    this.mode === "create" ?
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      ) :
      this.postsService.updatePost(
        this.postId as string,
        this.form.value.title,
        this.form.value.content
      )
    this.router.navigate(['../'])
    this.form.reset()
  }

  onImagePick(event: Event): void {
    //* These const separation was made for best pracice and to remove TS type check errors
    const imageFileList: FileList = (event.target as HTMLInputElement).files as FileList
    const imageFile: File = imageFileList[0]

    this.form.patchValue({image: imageFile})
    this.form.get('image')?.updateValueAndValidity()

    this.loadImagePreview(imageFile)

  }

  loadImagePreview(imageFile: File): void {
    //? onload event is fired when a file has been read successfully
    const reader: FileReader = new FileReader()                   //! Initiates a file reader
    reader.onload = (): void => {                                 //! Define what should happen when is done reading a file
      this.imagePreview = reader.result as string
      if (this.form.get('image')?.hasError('invalidMimeType')) {
        this.showError(
          'Uploaded file is not image format !',
          'Please upload a JPG,JPEG or PNG file.'
        )
      }
    }
    reader.readAsDataURL(imageFile)                               //! Instruct to load that file
  }

  showError(msgError: string, msgContent: string): void {
    this.messageService.add({severity: 'error', summary: msgError, detail: msgContent});
  }


}
