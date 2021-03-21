import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-row-widget',
  templateUrl: './row-widget.component.html',
  styleUrls: ['./row-widget.component.css']
})
export class RowWidgetComponent implements OnInit {
  @Input() items:any;
  constructor(private userService: UserService,private toastr: ToastrService, private route: Router) { }

  ngOnInit(): void {
    console.log(this.items)
  }

  editUser(_id){
    this.route.navigate(['/user/update/'+_id]);
  }

  removeUser(_id){
    this.userService.removeUser(_id).subscribe((result) =>{
      if(result['status']){
        this.toastr.success(result['message']);
      }
    });
  }
}
