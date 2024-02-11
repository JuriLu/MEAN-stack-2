import {Component, OnInit} from '@angular/core';
import {Post} from "../interfaces/post.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../services/posts.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {mimeTypeValidator} from "./mime-type.validator";
import {MessageService} from "primeng/api";
import {PostFormInterface} from "../interfaces/postForm.interface";
import {CreateModeEnum} from "../enums/createMode.enum";
import {CreateModeType} from "../types/createMode.type";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {
  post!: Post
  isLoading: boolean = false
  imagePreview!: string

  form!: FormGroup<PostFormInterface>
  private mode: CreateModeType = CreateModeEnum.CREATE
  private postId!: string | null

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService
  ) {
  }

  ngOnInit(): void {
    this.definingCreateOrEditMode()
    this.definingForm()
  }

  get Mode(): string {
    return this.mode
  }

  definingForm(): void {
    this.form = new FormGroup<PostFormInterface>({
      title: new FormControl<string | null>(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl<string | null>(null, {
        validators: [Validators.required]
      }),
      image: new FormControl<File | string | null>(null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      })
    })
  }

  //TODO: Might turn into a Resolver
  definingCreateOrEditMode(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap): void => {
      if (paramMap.has('postId')) {
        this.mode = CreateModeEnum.EDIT
        this.postId = paramMap.get('postId') as string
        this.isLoading = true

        this.postsService.getPost(this.postId).subscribe((responsePost: Post): void => {
          this.isLoading = false
          this.imagePreview = responsePost.imagePath
          this.form.setValue({
            title: responsePost.title,
            content: responsePost.content,
            image: responsePost.imagePath
          })
        })
      } else {
        this.mode = CreateModeEnum.CREATE
        this.postId = null
      }
    })

  }

  onSavePost(): void {
    if (this.form.invalid) {
      return;
    }

    this.isLoading = true

    this.mode === CreateModeEnum.CREATE ?
      this.postsService.addPost(
        this.form.value.title as string,
        this.form.value.content as string,
        this.form.value.image as File
      ) :
      this.postsService.updatePost(
        this.postId as string,
        this.form.value.title as string,
        this.form.value.content as string,
        this.form.value.image as File | string
      )
    this.router.navigate(['../'])
    this.form.reset()
  }

  onImagePick(event: Event): void {
    //* These consts separation was made for best pracice and to remove TS type check errors
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

  postAndUpdateWithLogs(): void {
    if (this.mode === CreateModeEnum.CREATE) {
      console.log('Image Form from CREATE', this.form.value.image)
      this.postsService.addPost(
        this.form.value.title as string,
        this.form.value.content as string,
        this.form.value.image as File
      )
    } else {
      console.log('Image Form from EDIT', this.form.value.image)
      this.postsService.updatePost(
        this.postId as string,
        this.form.value.title as string,
        this.form.value.content as string,
        this.form.value.image as File
      )
    }
  }


  protected readonly CreateModeEnum = CreateModeEnum;
}
