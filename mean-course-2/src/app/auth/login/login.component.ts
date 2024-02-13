import {Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, Validators} from "@angular/forms";

interface LoginFormInterface{
  email: AbstractControl<string | null>;
  password: AbstractControl<string | null>;
}

@Component({
  selector: 'app-login', //will be loaded by routing , so its not necessary
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit,OnDestroy {
  form!: FormGroup<LoginFormInterface>
  isLoading:boolean = false
  constructor() {
    this.defineForm()
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  defineForm():void{
    this.form = new FormGroup<LoginFormInterface>({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    })
  }

  onSavePost():void{
    console.log(this.form.value)
  }

}
