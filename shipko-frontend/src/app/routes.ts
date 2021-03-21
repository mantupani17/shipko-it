import { Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";
import { HomeComponent } from "./home/home.component";
import { SigninComponent } from "./user/signin/signin.component";
import { SignupComponent } from "./user/signup/signup.component";
import { UpdateComponent } from "./user/update/update.component";
import { UserComponent } from "./user/user.component";

export const appRoutes : Routes = [
    { path:'home', component: HomeComponent , canActivate:[AuthGuard]},
    { path:'signup', component: UserComponent, children:[
        { path:'', component:SignupComponent }
    ]},
    { path:'login', component: UserComponent, children:[
        { path:'', component:SigninComponent }
    ]},
    { path:'' , redirectTo: '/login', pathMatch:'full'},
    { path: 'user/update/:id' , component: UpdateComponent, canActivate:[AuthGuard]}
];