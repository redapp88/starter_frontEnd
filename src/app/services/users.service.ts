import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {HttpClient} from '@angular/common/http';
import {AlertController} from '@ionic/angular';
import {Observable, Subject} from 'rxjs';
import {User} from '../models/User.model';
import {environment} from '../../environments/environment';
import {Profile} from '../models/Profile.model';
import {Project} from '../models/Project.model';
import {SharedService} from './shared.service';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    usersSubject: Subject<any> = new Subject<any>();
    userSubject: Subject<any> = new Subject<any>();
    users: User[]
    user: User;

    emitUsers() {
        this.usersSubject.next(this.users);
    }

    emitUser() {
        this.userSubject.next(this.user);
    }

    constructor(private authService: AuthService,
                private http: HttpClient,
                private sharedService: SharedService) {
    }

    public fetchUsers(keyword: string, city: string, state: string, profiles: Profile[]) {
        return new Observable(observer => {

            this.http.put
            (`${environment.backEndUrl}/user/users?keyword=${keyword}&city=${city}&state=${state}`,profiles, this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    //console.log(resData)
                    this.users = resData;
                    this.emitUsers();
                    observer.complete()
                },
                (error) => {
                    observer.error(error)
                }
            )

        })
    }


    subscribe(username: string,
              password: string,
              name: string,
              mail: string,
              phone: string,
              description: string,
              city: string,
              projects: Project[],
              profiles: Profile[]) {
        return new Observable(observer => {
            this.http.post
            (`${environment.backEndUrl}/user/user/add`,
                {
                    username: username,
                    password: password,
                    name: name,
                    phone: phone,
                    mail: mail,
                    description: description,
                    city: city,
                    projects: projects,
                    profiles: profiles
                },
                this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    observer.complete();
                },
                (error) => {
                    observer.error(error)
                }
            )
        })
    }

    editUser(username: string,
             name: string,
             mail: string,
             phone: string,
             description: string,
             city: string,
             projects: Project[],
             profiles: Profile[],
             state: string) {
        return this.http.put
        (`${environment.backEndUrl}/user/user/edit?username=${username}`,
            {
                name: name,
                phone: phone,
                mail: mail,
                description: description,
                city: city,
                projects: projects,
                profiles: profiles,
                state: state
            },
            this.authService.httpOptions())
    }

    editPassword(username: string, oldpassword: string, password: string) {
        return this.http.put
        (`${environment.backEndUrl}/user/user/editPassword?username=${username}`,
            {oldpassword: oldpassword, password: password},
            this.authService.httpOptions())
    }

    deleteUser(username: string) {
        return this.http.delete(`${environment.backEndUrl}admin/user/delete?username=${username}`
            , this.authService.httpOptions())
    }


    getUser(username: string) {
        return new Observable(observer => {
            this.http.get
            (`${environment.backEndUrl}/user/user?username=${username}`,
                this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.user = resData;
                    observer.complete();
                },
                (error) => {
                    observer.error(error)
                }
            )
        })

    }

    resetPassword(username: string, password: string) {
        return new Observable(observer => {
            this.http.put
            (`${environment.backEndUrl}/public/user/resetPassword?username=${username}`, {password: password}).subscribe(
                () => {
                    observer.complete();
                },
                (error) => {
                   this.sharedService.showAlert(error);
                }
            )
        })
    }


}
