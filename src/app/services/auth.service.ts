import {Injectable, OnDestroy} from '@angular/core';
import {Observable, of, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Plugins,Capacitor} from '@capacitor/core';
import {AppUser} from '../models/AppUser.model';
import {JwtHelper} from 'angular2-jwt';
import {Profile} from '../models/Profile.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
    activeLogoutTimer:any;
    userSubject=new Subject<AppUser>();
    curentUser:AppUser=null;

    constructor(private http:HttpClient) {}
public emitUser(){
        return this.userSubject.next(this.curentUser);
    }


public  subscribe(username: string, password: string, name: string, phone: string, adress: string) {
        return  this.http.post
        (`${environment.backEndUrl}/subscribe`,{username:username,password:password,name:name,phone:phone,adress:adress})
    }

    login(username:string,password:string){
        return new Observable((observer)=>{
            this.http.post(`${environment.backEndUrl}/login`,{username:username,password:password},{observe:"response"}).subscribe(
                (resData)=>{
                    let jwt=resData.headers.get("authorization");
                    this.setUserData(jwt);
                    // console.log(this.isUser()+"**"+this.curentUser)
                    observer.complete();
                },
                (error)=>{
                    console.log(error)
                    observer.error(error)}
            )



        })

    }
private setUserData(jwt:string){
        let jwtHelper=new JwtHelper();
        if(jwt){
            let user:AppUser=
                new AppUser(jwtHelper.decodeToken(jwt).sub,
                    jwtHelper.decodeToken(jwt).name,
                    jwtHelper.decodeToken(jwt).city,
                    jwtHelper.decodeToken(jwt).image,
                    jwtHelper.decodeToken(jwt).profiles,
                    jwtHelper.decodeToken(jwt).roles,
                    new Date(new Date().getTime()+ +jwtHelper.decodeToken(jwt).experition),
                    jwt)
            console.log(user)

            this.storeData(user);
            this.curentUser=user;
            this.autoLogout(user.tokenDuration);

            this.emitUser();
        }
    }

private storeData(user:AppUser){
        let currentUser=JSON.stringify(user);
        Plugins.Storage.set({key:'authData',value:currentUser})
    }


    autoLogin(){
        return new Observable<boolean>(observer=>{
            Plugins.Storage.get({key:'authData'}).then(
                (authData=>{
                    //console.log(authData.value);
                    if(!authData || !authData.value){
                        this.curentUser=null;
                        this.emitUser();
                        observer.next(false)

                    }
                    else{let data=JSON.parse(authData.value) as
                        { username:string,
                            name:string,
                            city:string,
                            image:any[],
                            profiles:Profile[],
                            roles:{authority:string}[],
                            expirationDate:string,
                            jwt:string};

                        let user=
                            new AppUser(data.username,data.name,data.city,data.image,data.profiles,data.roles,new Date(data.expirationDate),data.jwt)

                        if(user.expirationDate<= new Date())
                        {

                            this.curentUser=null;
                            this.emitUser();
                            observer.next(false)

                        }

                        else{
                            this.curentUser=user;
                            //console.log(user)
                            this.emitUser();
                            observer.next(true);
                            this.autoLogout(user.tokenDuration);
                        }
                    }
                    observer.complete()
                })
            )


        })

    }

    userIsAuthentificated():Observable<boolean>{
        let result=false
        if(this.curentUser)
    result=!!this.curentUser.jwt
    return of (result)
}

    autoLogout(duration:number){
        if(this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer)
        }

        this.activeLogoutTimer=setTimeout(()=>{this.logout()},duration)
    }
    logout(){
        if(this.activeLogoutTimer) {
            clearTimeout(this.activeLogoutTimer)
        }
        this.curentUser=null;
        Plugins.Storage.remove({key:'authData'})
        this.emitUser();
    }


    ngOnDestroy(): void {
        if(this.activeLogoutTimer) {
        clearTimeout(this.activeLogoutTimer)
    }
}

    isUser(){
        if(!this.curentUser)
            return false
        return this.curentUser.roles.filter(r=>r.authority==="USER").length>0;
    }

    isManager(){
        if(!this.curentUser)
            return false

        return this.curentUser.roles.filter(r=>r.authority==="MANAGER").length>0;
    }

    isAuthentificated():Observable<boolean>{
        console.log(this.curentUser)
    let result=false
    if(this.curentUser && this.curentUser != null)
        result= true
    return of (result)
}



public httpOptions(){
        let httpOptions
        if(this.curentUser != null)
        {

            httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json',
                    'Authorization': this.curentUser.jwt
                })
            };
        }
        else {
            httpOptions = {
                headers: new HttpHeaders({
                    'Content-Type':  'application/json'
                })
            };  }

        return httpOptions;
    }

}