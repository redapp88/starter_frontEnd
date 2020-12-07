import {Component, Input, OnInit} from '@angular/core';
import {Project} from '../../models/Project.model';
import {Subscription} from 'rxjs';
import {ProjectsService} from '../../services/projects.service';
import {LoadingController, NavController, PopoverController} from '@ionic/angular';
import {AppUser} from '../../models/AppUser.model';
import {Route, Router} from '@angular/router';

@Component({
    selector: 'app-user-programs',
    templateUrl: './user-programs.component.html',
    styleUrls: ['./user-programs.component.scss'],
})
export class UserProgramsComponent implements OnInit {
    @Input() user: AppUser
    loadedUsersProjects: Project[];
    usersProjectsSubscription: Subscription;

    constructor(private projectsService: ProjectsService,
                private loadingCtrl: LoadingController,
                private router: Router,
                private popOverCtrl: PopoverController) {
    }

    ngOnInit() {

    }

    ionViewWillEnter() {

        this.usersProjectsSubscription = this.projectsService.usersProjectsSubject.subscribe(
            (resultData) => {
                this.loadedUsersProjects = resultData;

            }
        )

        this.loadUsersProjects();


    }

    loadUsersProjects() {

        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
            loadingEl.present();
            this.projectsService.fetchUsersProjects(this.user.username, '*', '*', '', '*').subscribe(
                () => {
                },
                (error) => {
                    loadingEl.dismiss();
                    console.log(error)
                },
                () => {
                    loadingEl.dismiss();
                }
            )
        })
    }


    onGoToProgrammes() {
        this.popOverCtrl.dismiss()
        this.router.navigate(['/projects'])
    }

    onGoToUsers(project: Project) {
        //console.log(project)
        //console.log(project)
        this.projectsService.selectedProject = project
        this.projectsService.emitselectedProject()
        this.popOverCtrl.dismiss()
        //console.log(this.router.url);
        if(this.router.url!=='/users')
                this.router.navigate(['users', 'projectId', project.id])


    }
}
