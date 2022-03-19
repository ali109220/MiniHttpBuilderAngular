import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/shared.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers:[MessageService]
})
export class RegisterComponent implements OnInit {

  hide:boolean=true;
  registerForm: FormGroup = new FormGroup({});
  registerFormInput: any = {
    username: '',
    password: ''
  };
  
  submitted: boolean = false;
  loading: boolean=false;
  constructor(private router: Router ,
    private _formbuilder: FormBuilder, 
    private _userService : UserService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.registerForm = this._formbuilder.group({
      username: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }
  submitRegister() {
    this.submitted = true;
    if (this.registerForm.invalid)
      return;
    else {this.loading = true;
      this._userService.register(this.registerFormInput).subscribe(
        (res:any) => {
          this._userService.login({username: this.registerFormInput.username,
          password: this.registerFormInput.password}).subscribe(
            (res:any) => {
            localStorage.setItem('x-access-token', res.token);
            this.router.navigate(['/html-docs']);
            },
            (err:any) => {
              console.log(err);
            });
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Register Successfully'});this.loading = false;
        },
        (err:any) => {
          debugger;this.loading = false;
          if(err.message?.includes("Http failure response") && err.status != 401)
            this.messageService.add({severity:'error', summary: 'Error', detail: "There is no connection with server. please try again later. Thanks"});
          else
          this.messageService.add({severity:'error', summary: 'Error', detail: "Username or password is not correct."});
        });
    }
  }

}
