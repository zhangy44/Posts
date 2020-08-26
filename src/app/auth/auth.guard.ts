import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router
  } from "@angular/router";
  import { Injectable } from "@angular/core";
  import { Observable } from "rxjs";
  
  import { AuthService } from "./auth.service";
  //Angular add some interfaces your classes can implement which forces
  //the classes to add certain methods which the @angular/router can execute before it
  //loads a rout to check whether it should proceed or do something

  @Injectable()
  export class AuthGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}
  
    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
      const isAuth = this.authService.getIsAuth();
      if (!isAuth) {
        this.router.navigate(['/login']);
      }
      return isAuth;
    }
  } 