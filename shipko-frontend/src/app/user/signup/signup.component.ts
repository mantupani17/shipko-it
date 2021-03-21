import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr'
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  user: User;
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  constructor(private userService: UserService, private toastr: ToastrService, private router : Router) { }

  ngOnInit(): void {
    this.resetForm();
  }

  OnSubmit(data):void {
    this.userService.registerUser(data.value).subscribe((result) => {
      // This code will be executed when the HTTP call returns successfully 
      if (result['status'] == true) {
        this.resetForm(data);
        this.toastr.success('User registration successful');
        localStorage.setItem('userToken',result['data']);
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
      firstName: '',
      password: '',
      email: '',
      lastName: '',
      mobile: ''
    }
  }

}
