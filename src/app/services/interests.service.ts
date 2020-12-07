import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {SharedService} from './shared.service';
import {Observable, Subject} from 'rxjs';
import {AuthService} from './auth.service';
import {Interest} from '../models/Interest.model';

@Injectable({
    providedIn: 'root'
})
export class InterestsService {
    interestsSubject: Subject<any> = new Subject<any>();
    interests: Interest[]

    emitInterests() {
        this.interestsSubject.next(this.interests);
    }


    constructor(private authService: AuthService,
                private http: HttpClient,
                private sharedService: SharedService) {
    }

    public fetchInterests(username: string, id) {
        return new Observable(observer => {

            this.http.get
            (`${environment.backEndUrl}/user/interest/interests?username=${username}&id=${id}`,
                this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.interests = resData;
                    this.emitInterests()
                    observer.complete()
                },
                (error) => {
                    observer.error(error)
                }
            )

        })
    }


    addInterest(username: string, id: number, message: string, direction: string) {
        return new Observable(observer => {
            this.http.post
            (`${environment.backEndUrl}/user/interest/add`,
                {
                    username: username,
                    id: id,
                    message: message,
                    direction: direction
                },
                this.authService.httpOptions()).subscribe(
                (resData:Interest) => {
                    this.interests.push(resData);
                    observer.complete();
                },
                (error) => {
                    observer.error(error)
                }
            )
        })
    }


    editInterest(
       id:number, username: string, projectIid: number, message: string, direction: string,state:string) {
        return this.http.put
        (`${environment.backEndUrl}/user/interest/edit?id=${id}`,
            {
                username: username,
                id: id,
                message: message,
                direction: direction,
                state:state
            },
            this.authService.httpOptions())
    }


    deleteInterest(id) {
        return new Observable(observer => {
            this.http.delete(`${environment.backEndUrl}/user/interest/delete?id=${id}`
                , this.authService.httpOptions()).subscribe(
                () => {
                    this.interests= this.interests.filter(i => i.id !== id);
                    observer.complete();
                },
                (error) => {
                    observer.error(error)
                }
            )
        })
    }



}