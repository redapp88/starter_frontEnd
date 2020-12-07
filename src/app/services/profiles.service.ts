import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Project} from '../models/Project.model';
import {environment} from '../../environments/environment';
import {SharedService} from './shared.service';
import {Observable, Subject} from 'rxjs';
import {AuthService} from './auth.service';
import {Profile} from '../models/Profile.model';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {
    profilesSubject: Subject<any> = new Subject<any>();
    profiles: Profile[]

    emitProfiles() {
        this.profilesSubject.next(this.profiles);
    }


    constructor(private authService: AuthService,
                private http: HttpClient,
                private sharedService: SharedService) {
    }

    public fetchProfiles(keyword:string) {
        return new Observable(observer => {

            this.http.get
            (`${environment.backEndUrl}/public/profile/profiles?keyword=${keyword}`, this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.profiles = resData;
                    //console.log("profiles:",this.profiles)
                    this.emitProfiles();
                    observer.complete()
                },
                (error) => {
                    observer.error(error)
                }
            )

        })
    }


    addProfile(label: string) {
        return new Observable(observer => {
            this.http.post
            (`${environment.backEndUrl}/admin/profile/add"`,
                {
                    label:label
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

    editPProfile(
        id: number,
        label: string) {
        return this.http.put
        (`${environment.backEndUrl}/admin/profile/edit?id=${id}`,
            {
                label: label
            },
            this.authService.httpOptions())
    }


    deleteProject(id: number) {
        return this.http.delete(`${environment.backEndUrl}/admin/project/delete?id=${id}`
            , this.authService.httpOptions())
    }



}
