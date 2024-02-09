import {AbstractControl} from "@angular/forms";
import {Observable, Observer} from "rxjs";

type frObsType = { [key: string]: any } | null

//! Validators, if returns null it means it is VALID
//! If it return an object means it is NOT VALID (in this case its Async Validator so it will return Promise or Observable with that object)

//* MIME TYPE: JPG JPEG PNG GIF ect , check only for images
export const mimeTypeValidator = (control: AbstractControl<File>): Promise<{ [key: string]: any }> | Observable<frObsType> => {
  const file: File = control.value
  const fileReader: FileReader = new FileReader()
  // * fileReader.onloadend = () => {} THIS CAN NOT BE USED HERE, BECAUSE ITS NOT ASYNC (NOT PROMISE OR OBSERVABLE) SO WE NEED TO CREATE AN OBSERVABLE FOR THIS CASE

  return new Observable((observer: Observer<{
    [key: string]: any
  } | null>): void => {
    fileReader.addEventListener(
      "loadend",
      (): void => {
      const array: Uint8Array = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4)
        // console.log('Unit8Array',array)
      let header: string = ''
      let isValid: boolean = false

      for (let i: number = 0; i < array.length; i++) {
        header += array[i].toString(16)
        // console.log(array[i] + ' ' + array[i].toString(16))
      }

      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false;
          break
      }

      isValid ? observer.next(null) : observer.next({invalidMimeType: true})
      observer.complete()
    })

    fileReader.readAsArrayBuffer(file)
  })
}
