import {AbstractControl} from "@angular/forms";

export interface PostFormInterface {
  title: AbstractControl<string | null>;
  content: AbstractControl<string | null>
  image: AbstractControl<File | string | null>,
  id?: string | any;
}
