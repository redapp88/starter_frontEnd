import {Injectable} from '@angular/core';
import {User} from '../models/User.model';
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
export class ProjectsService {
    projectsSubject: Subject<any> = new Subject<any>();
    projects: Project[]

    usersProjectsSubject: Subject<any> = new Subject<any>();
    usersProjects: Project[]
    selectedProject:Project
    selectedProjectSubject: Subject<any> = new Subject<any>();

    emitPojects() {
        this.projectsSubject.next(this.projects);
    }

    emitUsersPojects() {
        this.usersProjectsSubject.next(this.usersProjects);
    }

    emitselectedProject() {
    this.selectedProjectSubject.next(this.selectedProject);
    }


    constructor(private authService: AuthService,
                private http: HttpClient,
                private sharedService: SharedService) {
    }

    public fetchProjects(username: string, categorie: string, city: string, keyword: string, state: string, compatibles: boolean, searcher: string) {
        return new Observable(observer => {

            this.http.get
            (`${environment.backEndUrl}/public/project/projects?username=${username}&categorie=${categorie}&keyword=${keyword}&city=${city}&state=${state}&compatibles=${compatibles}&searcher=${searcher}`, this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.projects = resData;
                    this.emitPojects();
                    observer.complete()
                },
                (error) => {
                    observer.error(error)
                }
            )

        })
    }


    public fetchUsersProjects(username: string, categorie: string, city: string, keyword: string, state: string) {
        return new Observable(observer => {

            this.http.get
            (`${environment.backEndUrl}/public/project/projects?username=${username}&categorie=${categorie}&keyword=${keyword}&city=${city}&state=${state}`, this.authService.httpOptions()).subscribe(
                (resData: any) => {
                    this.usersProjects = resData;
                    this.emitUsersPojects()
                    observer.complete()
                },
                (error) => {
                    observer.error(error)
                }
            )

        })
    }


    addProject(username: string,
               title: string,
               description: string,
               city: string,
               categorie: string,
               profiles: Profile[]) {
        return new Observable(observer => {
            this.http.post
            (`${environment.backEndUrl}/user/project/add"`,
                {
                    username: username,
                    title: title,
                    description: description,
                    city: city,
                    categorie: categorie,
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

    editProject(
        id: number,
        username: string,
        title: string,
        description: string,
        city: string,
        categorie: string,
        profiles: Profile[],
        state: string) {
        return this.http.put
        (`${environment.backEndUrl}/user/project/edit?id=${id}`,
            {
                username: username,
                title: title,
                description: description,
                city: city,
                categorie: categorie,
                profiles: profiles,
                state: state
            },
            this.authService.httpOptions())
    }


    deleteProject(id: number) {
        return this.http.delete(`${environment.backEndUrl}/user/delete?id=${id}`
            , this.authService.httpOptions())
    }


    /*    getProject(id: number) {
            return new Observable(observer => {
                this.http.get
                (`${environment.backEndUrl}/user/project?id=${id}`,
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

        }*/


}
