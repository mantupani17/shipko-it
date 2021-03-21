import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  user:any;
  constructor(private userService: UserService, private toastr: ToastrService, private router : Router) { }

  ngOnInit(): void {
    this.resetForm()
  }

  OnSubmit(form){
    this.userService.userAuthentication(form.value).subscribe((result) => {
      // This code will be executed when the HTTP call returns successfully 
      if (result['status'] == true) {
        this.resetForm(form);
        this.toastr.success('User loggedin successful');
        localStorage.setItem('userToken',result['token']);
        this.router.navigate(['/home']);
      }else{
        this.toastr.error(result['message']);
      }
    });
  }

  resetForm(form?: NgForm) {
    if (form != null)
      form.reset();

    this.user = {
      password: '',
      email: ''
    }
  }
}
