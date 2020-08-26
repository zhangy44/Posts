import { Component ,  OnInit, OnDestroy} from '@angular/core';
import { Post } from '../post.model'
import { PostService } from '../post.service';
import { Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';
import { PostCreateComponent } from '../create-post/create-post.component';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
    selector : 'app-post-list-component',
    templateUrl : './post-list.component.html',
    styleUrls : ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy{
    // posts = [
    //     {title : 'First Post', content : 'this is content'},
    //     {title : 'Second Post', content : 'this is content'},
    //     {title : 'Third Post', content : 'this is content'},
    // ]
    
    private postSub : Subscription;
    private authStatusSub : Subscription; 

    posts : Post[]=[];
    totalPosts = 0;
    postPerPage = 2;
    currentPage = 1;
    pageSizeOptions = [1,2,5,10];
    isLoading = false;
    userIsAuth = false; 
    userId : string;

    constructor(public postService : PostService, private authService : AuthService){}
    ngOnInit(){
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.postService.getPosts(this.postPerPage, this.currentPage);
        this.postSub = this.postService.getPostUpdatedListener()
        .subscribe((postData :{posts : Post[], postCount : number} ) => {
            this.isLoading = false;
            this.totalPosts = postData.postCount;
            this.posts = postData.posts;
        });
        this.userIsAuth = this.authService.getIsAuth();
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            (isAuth) =>{
                this.userIsAuth = isAuth;
                this.userId = this.authService.getUserId();
            }
        ); 
    }
    onDelete(postId : string){
        this.isLoading = true;
        this.postService.deletePost(postId).subscribe(()=>{
            this.postService.getPosts(this.postPerPage, this.currentPage);
        },()=>{
            this.isLoading = false;
        });
    }
    ngOnDestroy(){
        this.postSub.unsubscribe();
        this.authStatusSub.unsubscribe();  
    }
    onChangedPage(pageData : PageEvent){
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postPerPage = pageData.pageSize;
        this.postService.getPosts(this.postPerPage, this.currentPage);
    }
}