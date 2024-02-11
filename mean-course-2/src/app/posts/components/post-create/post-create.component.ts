import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {PostsService} from "../../services/posts.service";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {mimeTypeValidator} from "./mime-type.validator";
import {MessageService} from "primeng/api";
import {PostFormInterface} from "../../interfaces/postForm.interface";
import {CreateModeEnum} from "../../enums/createMode.enum";
import {CreateModeType} from "../../types/createMode.type";
import {PostModel} from "../../models/post.model";
import {PostResponseDto} from "../../dto/postResponse.dto";


@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.scss'
})
export class PostCreateComponent implements OnInit {
  post!: PostModel
  isLoading: boolean = false
  imagePreview!: string
  fileType: boolean = false

  form!: FormGroup<PostFormInterface>
  private mode: CreateModeType = CreateModeEnum.CREATE
  private postId!: string | null

  protected readonly CreateModeEnum = CreateModeEnum;


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
    this.checkFileTypeOnChange()
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

        this.postsService.getPost(this.postId).subscribe((responsePost: PostResponseDto): void => {
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
    const reader: FileReader = new FileReader()
    reader.onload = (): void => {
      this.imagePreview = reader.result as string
      if (this.form.get('image')?.hasError('invalidMimeType')) {
        this.showError(
          'Uploaded file is not image format !',
          'Please upload a JPG,JPEG or PNG file.'
        )
        this.form.get('image')?.reset()
      }
    }
    reader.readAsDataURL(imageFile)
  }

  showPreviewCheck(type: string): boolean {
    if (type === CreateModeEnum.EDIT) {
      return !!(
        this.imagePreview &&
        this.imagePreview !== '' &&
        this.Mode === CreateModeEnum.EDIT &&
        this.fileType
      )
    } else {
      return !!(
        this.imagePreview &&
        this.imagePreview !== '' &&
        this.form.get('image')?.valid
      )
    }
  }


  checkFileTypeOnChange(): void {
    this.form.get('image')?.valueChanges.subscribe((image: string | File | null): void => {
        if (image instanceof File) {
          (image.type.split('/')[0] === 'image') ? this.fileType = true : this.fileType = false
        } else {
          let imageType: string = image?.split('.')[1] as string
          switch (imageType) {
            case 'jpg':
            case 'jpeg':
            case 'png':
              this.fileType = true
              break
            default:
              this.fileType = false
              break
          }
        }
      }
    )
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


}
