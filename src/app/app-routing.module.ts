import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { PostListComponent } from './post/post-list/post-list.component';
import { PostCreateComponent } from './post/create-post/create-post.component';
import { LoginComponent } from './auth/login/login/login.component';
import { SignupComponent } from './auth/signup/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
//managing Angular routes
const routes : Routes = [
    { path : '', component : PostListComponent},
    { path : 'create' , component : PostCreateComponent, canActivate:[AuthGuard]},
    { path : 'edit/:postId' , component : PostCreateComponent, canActivate:[AuthGuard]},
    { path : 'login', component : LoginComponent},
    { path : 'signup', component : SignupComponent}
];
   


@NgModule({
    imports : [RouterModule.forRoot(routes)],
    exports : [RouterModule],
    providers :[AuthGuard]
})
export class AppRoutingModule{

}