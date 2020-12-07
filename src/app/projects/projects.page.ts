import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {AlertController, LoadingController, ModalController, PopoverController, ToastController} from '@ionic/angular';
import {ProjectsService} from '../services/projects.service';
import {SharedService} from '../services/shared.service';
import {AppUser} from '../models/AppUser.model';
import {Project} from '../models/Project.model';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginComponent} from '../login/login.component';
import {UserProgramsComponent} from '../shared/user-programs/user-programs.component';
import {Interest} from '../models/Interest.model';
import {InterestsService} from '../services/interests.service';
import {AddInterestComponent} from '../shared/add-interest/add-interest.component';
import {ProjectViewComponent} from './project-view/project-view.component';
import {Profile} from '../models/Profile.model';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.page.html',
    styleUrls: ['./projects.page.scss'],
})
export class ProjectsPage implements OnInit {

   constructor(private router: Router,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private projectsService: ProjectsService,
    private sharedService: SharedService,
    private modalCtrl: ModalController,
    private toastctrl: ToastController,
    private popOverCtrl: PopoverController,
    private interestsService: InterestsService) {
}

currentUser: AppUser;
loadedProjects: Project[];
projectsSubscription: Subscription;
userSubscription: Subscription;
loadedInterests: Interest[]=[];
interestsSubscription: Subscription;
formSearch: FormGroup;
defaultCity = '*';
defaultCategorie = '*'
interestDirection="ProjectToUser"
authenticated = false;
mode = 'projects'

ngOnInit() {
    this.formSearch = new FormGroup({
        keyword: new FormControl('', {
            validators: []
        }),
        categorie: new FormControl(this.defaultCategorie, {
            validators: [Validators.required]
        }),

        city: new FormControl(this.defaultCity, {
            validators: [Validators.required]
        }),
        compatibles: new FormControl(false, {
            validators: []
        }),
    });
    this.userSubscription = this.authService.userSubject.subscribe(
        (resData) => {
            if (resData === null) {
                this.currentUser = null;
                this.authenticated = false;
            }
            else {

                this.currentUser = this.authService.curentUser;
                this.authenticated = true;
                this.defaultCity = this.currentUser.city;
                this.setSelectedCity();

            }
        }
    )


}


onLogout() {
    this.authService.logout()
}

ionViewWillEnter() {

    if (this.authService.curentUser) {
        this.sharedService.loginSuccess();
        this.onLoadInterests();
    }


    else {
        this.authService.autoLogin().subscribe(
            (resData) => {
                if (resData) {
                    this.sharedService.loginSuccess();
                    this.onLoadInterests();
                }
            }
        )
    }
    this.projectsSubscription = this.projectsService.projectsSubject.subscribe(
        (resultData) => {
            this.loadedProjects = resultData;

        }
    )
    this.interestsSubscription = this.interestsService.interestsSubject.subscribe(
        (resultData) => {
            this.loadedInterests = resultData;

        }
    )

    if (this.authenticated)
        this.onLoadInterests();
    this.onLoadProjects();
}


loadProjects(keyword: string, categorie: string, city: string) {
    console.log(this.formSearch.value['compatibles'])

    this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
        loadingEl.present();
        this.projectsService.fetchProjects('*', categorie, city, keyword, '*', this.formSearch.value['compatibles'], this.currentUser?.username).subscribe(
            () => {
            },
            (error) => {
                loadingEl.dismiss();
                this.sharedService.showAlert(error.error.message)
            },
            () => {

                loadingEl.dismiss();
            }
        )
    })
}

onLoadProjects() {
    //console.log(this.authService.curentUser.username, this.formSearch.value['keyword'], this.formSearch.value['current'], this.formSearch.value['ended'])

    this.loadProjects(this.formSearch.value['keyword'], this.formSearch.value['categorie'], this.formSearch.value['city'])

}

private onLoadInterests() {
    this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
        loadingEl.present();
        this.interestsService.fetchInterests(this.currentUser.username, '*').subscribe(
            () => {
            },
            (error) => {
                loadingEl.dismiss();
                console.log(error)
                this.sharedService.showAlert(error.error.message)
            },
            () => {

                loadingEl.dismiss();
            }
        )
    })
}

isAuthentificated() {
    return this.authService.isAuthentificated().subscribe(
        (res) => {
            this.authenticated = res;
        }
    );
}


onOpenLogin() {
    this.modalCtrl.create(
        {component: LoginComponent, cssClass: 'my-custom-modal-css'}
    ).then(modalEL => {
        modalEL.present();
        return modalEL.onDidDismiss()
    }).then(resData => {
        if (resData.role === 'success') {
            this.sharedService.loginSuccess();
            this.defaultCity = this.currentUser.city;
            console.log(this.defaultCity)
            this.setSelectedCity();
            this.onLoadProjects();
        }
    })
}

onInterest(project: Project) {
    if (!this.authenticated) {

        this.toastctrl.create({
            message: 'Vous devez etre connecter pour declarer un Interet à ce projet', cssClass: 'ion-text-center'
            , duration: 2000
        }).then(
            (modalEL) => {
                modalEL.present()
            }
        )
    }
    else {

        if (!this.hasProfileIntersection(project.profiles, this.currentUser.profiles)) {
            this.sharedService.showToast('Ce projet ne cherches pas les competances mentionés dans votre compte', 2000)
        }
        else {
            this.modalCtrl.create(
                {
                    component: AddInterestComponent,
                    componentProps: {project: project, username: this.currentUser.username, direction: 'UserToProject'},
                    cssClass: 'my-custom-modal-css'
                }
            ).then(modalEL => {
                modalEL.present();
                return modalEL.onDidDismiss()
            }).then(resData => {
                if (resData.role === 'success') {
                    this.interestsService.emitInterests();
                }
            })
        }
    }
}

onCancelInterest(interest: Interest) {
    this.alertCtrl.create(
        {
            header: 'Confirmation',
            message: `Voulez vous annuler votre déclaration d'interet`,
            buttons: [{
                text: 'oui', handler: () => {
                    this.deleteInterest(interest.id)
                }
            }, {text: 'non', role: 'cancel'}]
        }
    ).then(alertEl => {
        alertEl.present()
    })
}

deleteInterest(id) {
    this.interestsService.deleteInterest(id).subscribe(
        () => {
        },
        (error) => {
            this.sharedService.showAlert(error)
        },
        () => {
            this.interestsService.emitInterests()
        }
    )
}

public OnViewUserProjects(event) {
    this.popOverCtrl.create({
        component: UserProgramsComponent,
        componentProps: {user: this.currentUser},
        event: event

    }).then(popEl => {
        popEl.present();
    })
}


onProjectView(project:Project){
    if(this.authenticated){
        let interests:Interest[]=[];
        if(this.getInterest(project.id,this.currentUser.username,"UserToProject").length>0){
            let interest1:Interest=this.getInterest(project.id,this.currentUser.username,"UserToProject")[0];
            interests.push(interest1);

        }
        if(this.getInverseInterestByDetais(this.currentUser.username,project.id,"UserToProject").length>0){
            let interest2:Interest=this.getInverseInterestByDetais(this.currentUser.username,project.id,"UserToProject")[0];
            interests.push(interest2);
        }



        this.modalCtrl.create(
            {
                component: ProjectViewComponent,
                componentProps: {project: project, interests: interests},
                cssClass: 'big-modal-css'
            }
        ).then(modalEL => {
            modalEL.present();
            return modalEL.onDidDismiss()
        }).then(resData => {
            if (resData.role === 'success') {
                //this.interestsService.emitInterests();
            }
        })

    }
}


private clearFields() {
    this.formSearch.patchValue({keyword: '', categorie: '', city: ''})
}

private setSelectedCity() {
    this.formSearch.patchValue({city: this.defaultCity})
}


onShow(mode: string) {
    this.mode = mode;
}


getInverseInterest(interest: Interest): Interest[] {
    return this.loadedInterests?.slice().filter(
        i => i.user.username === interest.user.username && i.project.id === interest.project.id && i.direction === this.inverseInterestDirection(interest.direction))
}

getInverseInterestByDetais(username, id, direction): Interest[] {
    return this.loadedInterests?.slice().filter(
        i => i.user.username === username && i.project.id === id && i.direction === this.inverseInterestDirection(direction))
}


getInterest(projectId, username, direction): Interest[] {
    return this.loadedInterests.slice().filter(
        i => i.user.username === username && i.project.id === projectId && i.direction === direction)
}

private inverseInterestDirection(direction: String): string {
    if (direction === 'UserToProject')
        return 'ProjectToUser'
    else
        return 'UserToProject';

}

private hasProfileIntersection(pfs1: Profile[], pfs2: Profile[]): boolean {
    return pfs1.filter(o => pfs2.some(({id}) => o.id === id)).length > 0;
}
}
