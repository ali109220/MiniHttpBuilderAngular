import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { UserService } from 'src/app/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers:[MessageService]
})
export class LoginComponent implements OnInit {
  hide:boolean=true;
  loginForm: FormGroup = new FormGroup({});
  loginFormInput: any = {
    username: '',
    password: ''
  };
  loading:boolean=false;
  submitted: boolean = false;
  constructor(private router: Router ,
    private _formbuilder: FormBuilder, 
    private _userService : UserService,
    private messageService: MessageService) { }

  ngOnInit(): void {
    this.loginForm = this._formbuilder.group({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }
  submitLogin() {
    this.submitted = true;
    if (this.loginForm.invalid)
      return;
    else {
      this.loading = true;
      this._userService.login(this.loginFormInput).subscribe(
        (res:any) => {
          localStorage.setItem('x-access-token', res.token);
          this.loginFormInput = {
            username: '',
            password: ''
          };
        
        this.router.navigate(['/html-docs']);
        this.messageService.add({severity:'success', summary: 'Success', detail: 'Login Successfully'});
         this.loading = false;
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
