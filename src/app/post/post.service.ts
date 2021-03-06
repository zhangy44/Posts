import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map} from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable({providedIn: "root"})
export class PostService{
    private posts : Post[] = [];
    
    // emiiting whenever we add a post, so we also want to listen to it
    private postUpdated = new Subject<{ posts: Post[]; postCount: number }>();

    constructor(private http : HttpClient, private router:Router){}

    getPosts(postsPerPage : number, currentPage:number){
        const queryParams=`?pagesize=${postsPerPage}&page=${currentPage}`;
        this.http
        .get<{ message: string; posts: any; maxPosts: number }>(
            "http://localhost:3000/api/post" + queryParams
          )
          .pipe(
            map(postData => {
              return {
                posts: postData.posts.map(post => {
                  return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    imagePath: post.imagePath,
                    creator : post.creator
                  };
                }),
                
                maxPosts: postData.maxPosts
              };
            })
          )
          .subscribe(transformedPostData => {
            this.posts = transformedPostData.posts;
            this.postUpdated.next({
              posts: [...this.posts],
              postCount: transformedPostData.maxPosts
            });
          });
    }
    getPostUpdatedListener(){
        
        return this.postUpdated.asObservable();

    }
    getPost(id : string){
        // return {...this.posts.find(p => p.id === id)};
        return this.http.get<{_id : string, title : string, content : string, imagePath : string, creator : string}>("http://localhost:3000/api/post/"+id);
    }
    addPost(title : string , content : string, image : File){
        
        const postData = new FormData();
        
        postData.append("title", title);
        postData.append("content",content);
        postData.append("image", image, title);
        this.http
            .post<{message : string, post : Post}>(
                'http://localhost:3000/api/post',
                postData)
            .subscribe(
                (responseData)=>{
                    this.router.navigate(["/"]);
            });

    }
    deletePost(postId : string){
        return this.http.delete("http://localhost:3000/api/post/"+postId);
        
    }
    updatePost(id : string, title :string, content:string, image : File | string){
        let postData : Post | FormData;
        if(typeof(image) === "object"){
            postData = new FormData();
            postData.append("id",id);
            postData.append("title", title);
            postData.append("content",content);
            postData.append("image", image, title);
        }
        else{
            postData= {id:id, title:title, content:content, imagePath : image, creator : null};
        }
        
        this.http
            .put("http://localhost:3000/api/post/" + id , postData).subscribe(response=>{
                this.router.navigate(["/"]);
        })
    }
}