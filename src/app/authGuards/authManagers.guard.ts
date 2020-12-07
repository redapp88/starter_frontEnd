import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanLoad, Route, Router, RouterStateSnapshot, UrlSegment, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {switchMap, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardManagers implements CanLoad  {
    constructor(private authService:AuthService,private router:Router){}


    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

        return this.authService.isAuthentificated().pipe(switchMap(
            (isAuthenticated)=>{
                if(!isAuthenticated)
                {return this.authService.autoLogin()}
                else {return of (isAuthenticated)}
            }
            ),tap(isAuthenticated=>{
                if(!isAuthenticated || !this.authService.isManager())
                    this.router.navigate(['/login'])
            })
        )
    }


}
