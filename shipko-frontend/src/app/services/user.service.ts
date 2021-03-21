import { Injectable } from '@angular/core';
import { config } from '../models/configs';
import { User } from '../models/user/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Response } from "@angular/http";
// import { Observable } from 'rxjs';
// import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly rootUrl = config.hostUrl;
  constructor(private http: HttpClient) { }

  // registering the user
  registerUser(user: User){
    const body = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile,
      password: user.password
    }
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.post(this.rootUrl + 'user', body, {headers : reqHeader});
  }

  // get users
  getAllUsers(query){
    return this.http.get(this.rootUrl + 'user'+query);
  }

  // update users
  updateUser(id, data){
    return this.http.put(this.rootUrl + 'user/'+id, data);
  }

  // remove users
  removeUser(id){
    return this.http.delete(this.rootUrl + 'user/'+id);
  }

  // login users
  userAuthentication(authDetails:any) {
    var reqHeader = new HttpHeaders({'No-Auth':'True' });
    return this.http.post(this.rootUrl + 'user/login', authDetails, { headers: reqHeader });
  }

  // get user profile
  userProfile(){
    return this.http.get(this.rootUrl + 'user/profile');
  }

  // get user by user_id
  userByUserId(id){
    return this.http.get(this.rootUrl + 'user/'+id);
  }

}
