import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.css']
})
export class UpdateComponent implements OnInit {
  myprofile: any;
  address = {
    address_desc:'',
    state:'',
    district:'',
    city:'',
    pincode:''
  };
  pincodePattern = "^[0-9]{6}";

  constructor(private userService : UserService,private toastr: ToastrService,  private router : Router, private aroute: ActivatedRoute) {
    this.aroute.params.subscribe((params)=>{
      if(params && params.id){
        this.userService.userByUserId(params.id).subscribe((data)=>{
          if(data['status']){
            this.address = data['data'][0].address;
          }
        });
      }
      this.getMyProfile();
    });
  }

  getMyProfile(){
    this.userService.userProfile().subscribe((data: any) => {
      this.myprofile = data.data;
    });
  }

  ngOnInit(): void {
  }


  OnSubmit(form){
    this.aroute.params.subscribe((params)=>{
      if(params && params.id){
        this.userService.updateUser(params.id, {address: form.value}).subscribe((result)=>{
          if(result['status']){
            this.toastr.success(result['message']);
            this.router.navigate(['/home'])
          }
        })
      }
      this.getMyProfile();
    });
    
  }
}
