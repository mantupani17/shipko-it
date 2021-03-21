import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { Utils } from '../helpers/utils.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  myprofile:any;
  allUsers: any;
  isAdmin = false;
  constructor(private userService : UserService,  private router : Router) { 
    this.getMyProfile();
  }

  ngOnInit(): void {

  }

  getMyProfile(){
    this.userService.userProfile().subscribe((data: any) => {
      this.myprofile = data.data;
      if(this.myprofile.role == 'Admin'){
        this.getAllUsers({
            limit: 100,
            page:0,
            select: 'first_name,last_name,login_details,isLogin,mobile,email,address,isDeleted'
        });
        this.isAdmin = true;
      }
    });
  }

  getAllUsers(query){
    query = Utils.doUrlEncode(query)
    this.userService.getAllUsers(query).subscribe((data:any)=>{
      this.allUsers = [];
      if(data.status){
        this.allUsers = data.data;
      }
    })
  }
}
