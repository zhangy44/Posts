import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector : 'app-header-component',
    templateUrl : './header.component.html',
    styleUrls : ['./header.component.css']

})
export class HeaderComponent implements OnInit, OnDestroy{
    private authListenerSubs : Subscription;
    userIsAuthenticated = false;


    constructor(private authService : AuthService){}
    ngOnInit(){
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe( isAuth => {
            this.userIsAuthenticated = isAuth;
        });
    }
    onLogout(){
        this.authService.logout();
    }
    ngOnDestroy(){
        this.authListenerSubs.unsubscribe();
    }
}