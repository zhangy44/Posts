import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';


@Injectable({providedIn: "root"})
export class AuthService{
    private tokenTimer : any;
    private token;
    private authStatusListner = new Subject<boolean>();
    private isAuthenticated = false;
    private userId : string;

    constructor(private http : HttpClient, private router:Router){}
    getToken(){
        return this.token;
    }
    getAuthStatusListener(){
        //only want to return the observable part of that listener
        //so that we can't emit new values from other components
        //only want to be able to emit from within the service but be able to listen from other parts

        return this.authStatusListner.asObservable();
    }
    getIsAuth(){
        return this.isAuthenticated;
    }
    getUserId(){
        return this.userId;
    }
    createUser(email: string, password: string) {
        const authData: AuthData = { email: email, password: password };
        return this.http
          .post("http://localhost:3000/api/user/signup", authData)
          .subscribe(() => {
            this.router.navigate(['/']);
          }, error =>{
              this.authStatusListner.next(false);
          });
    }
    login(email : string, password : string){
        const authData: AuthData = { email: email, password: password };
        this.http.post<{token : string, expiresIn : number, userId : string}>("http://localhost:3000/api/user/login", authData)
            .subscribe( response =>{
                this.token = response.token;
                if(this.token){
                    const expiresDuration = response.expiresIn;
                    this.setAuthTime(expiresDuration);
                    this.isAuthenticated = true;
                    this.userId = response.userId;
                    this.authStatusListner.next(true);
                    const now = new Date();
                    const expirationDate = new Date(now.getTime() + expiresDuration * 1000 );
                    
                    this.saveAuthData(this.token, expirationDate, this.userId);
                    this.router.navigate(['/']);
                }
            }, error=>{
                this.authStatusListner.next(false);
            })
    }
    logout(){
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListner.next(false);
        clearTimeout(this.tokenTimer);
        this.clearAuthData();
        this.userId = null;
        this.router.navigate(['/']);
        
    }
    autoAuthUser(){
        const authInfo = this.getAuthData();
        if(!authInfo){
            return;
        }
        const now = new Date();
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if(expiresIn>0){
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.userId = authInfo.userId;
            this.setAuthTime(expiresIn / 1000);
            this.authStatusListner.next(true);
        }
    }
    private saveAuthData(token : string, expirationDate : Date, userId : string){
        localStorage.setItem('userId', userId);
        localStorage.setItem('token',token);
        localStorage.setItem('expiration', expirationDate.toISOString());
    }
    private clearAuthData(){
        localStorage.removeItem('userId');
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }
    private getAuthData(){
        const token = localStorage.getItem('token');
        const expirationDate = localStorage.getItem('expiration');
        const userId = localStorage.getItem('userId');
        if(!token || !expirationDate){
            return;
        }
        return{
            token : token,
            expirationDate : new Date(expirationDate),
            userId : userId
        }
    }
    private setAuthTime(duration : number){
        console.log("Setting time"+duration);  
        this.tokenTimer = setTimeout(()=>{
            this.logout();
        },duration * 1000)
    }
}