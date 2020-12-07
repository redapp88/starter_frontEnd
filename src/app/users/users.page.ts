import { Component, OnInit } from '@angular/core';
import {ProjectsService} from '../services/projects.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SharedService} from '../services/shared.service';
import {InterestsService} from '../services/interests.service';
import {UserProgramsComponent} from '../shared/user-programs/user-programs.component';
import {ProjectViewComponent} from '../projects/project-view/project-view.component';
import {AlertController, LoadingController, ModalController, PopoverController, ToastController} from '@ionic/angular';
import {Subscription} from 'rxjs';
import {AppUser} from '../models/AppUser.model';
import {Project} from '../models/Project.model';
import {Interest} from '../models/Interest.model';
import {Router} from '@angular/router';
import {AddInterestComponent} from '../shared/add-interest/add-interest.component';
import {AuthService} from '../services/auth.service';
import {LoginComponent} from '../login/login.component';
import {UsersService} from '../services/users.service';
import {Profile} from '../models/Profile.model';
import {ProfilesService} from '../services/profiles.service';
import {UserViewComponent} from './user-view/user-view.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})
export class UsersPage implements OnInit {
    constructor(private router: Router,
                private authService: AuthService,
                private alertCtrl: AlertController,
                private loadingCtrl: LoadingController,
                private projectsService: ProjectsService,
                private usersService:UsersService,
                private sharedService: SharedService,
                private modalCtrl: ModalController,
                private toastctrl: ToastController,
                private popOverCtrl: PopoverController,
                private interestsService: InterestsService,
                private profilesService:ProfilesService) {
    }

    currentUser: AppUser;
    selectedProject:Project

    loadedUsers: AppUser[];
    usersSubscription: Subscription;
    userSubscription: Subscription;
    profilesSubscription: Subscription;
    loadedInterests: Interest[]=[];
    interestsSubscription: Subscription;
    selectedProjectSubscription: Subscription;
    formSearch: FormGroup;
    defaultCity = '*';
    interestDirection="UserToProject"
    authenticated = false;
    mode = 'users'
    loadedProfiles:Profile[];
    selectedProfiles:Profile[]=[]

    ngOnInit() {
        this.formSearch = new FormGroup({
            keyword: new FormControl('', {
                validators: []
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
                }
            }
        )


        this.selectedProjectSubscription = this.projectsService.selectedProjectSubject.subscribe(
            (resultData) => {
                if(resultData==null){
                    this.router.navigate(["/projects"])
                    this.loadingCtrl.dismiss()
                }
                else{
                this.selectedProject = resultData;
                console.log(this.selectedProject)

                //console.log(this.selectedProject)
                this.defaultCity = this.selectedProject.city
                //console.log("city",this.defaultCity)
                //console.log("here")

                    this.resetUsersSearche();
                    this.onLoadUsers()


                }

            }
        )

        this.profilesSubscription=this.profilesService.profilesSubject.subscribe(
            (resultData) => {
                this.loadedProfiles = resultData;
                //console.log(this.loadedProfiles)
            }
        )

        this.projectsService.emitselectedProject()

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
        this.usersSubscription = this.usersService.usersSubject.subscribe(
            (resultData) => {
                this.loadedUsers = resultData;

            }
        )
        this.interestsSubscription = this.interestsService.interestsSubject.subscribe(
            (resultData) => {
                this.loadedInterests = resultData;
                console.log(this.loadedInterests)

            }
        )

        if (this.authenticated && this.selectedProject!=null){
            this.onLoadInterests();
        this.loadProfiles()
        this.selectedProfiles=this.selectedProject.profiles.slice()
        this.resetUsersSearche()
        //this.onLoadUsers();
        }

    }

    loadProfiles(){

        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
            loadingEl.present();
            this.profilesService.fetchProfiles('*').subscribe(
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


    loadUsers(keyword: string, city: string,profiles:Profile[]) {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
            loadingEl.present();
           this.usersService.fetchUsers(keyword,city,'active',profiles).subscribe(
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

    onLoadUsers() {
        //console.log(this.selectedProfiles)
        this.loadUsers(this.formSearch.value['keyword'], this.formSearch.value['city'], this.selectedProfiles)

    }

    private onLoadInterests() {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'chargement...'}).then((loadingEl) => {
            loadingEl.present();
            this.interestsService.fetchInterests('*', this.selectedProject.id).subscribe(
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
                this.setSelectedCity()
                this.setSelectedCity();
                this.onLoadUsers()
            }
        })
    }

    onInterest(user: AppUser) {
        if (!this.authenticated) {

            this.toastctrl.create({
                message: 'Vous devez etre connecter pour declarer un Interet à cette personne', cssClass: 'ion-text-center'
                , duration: 2000
            }).then(
                (modalEL) => {
                    modalEL.present()
                }
            )
        }
        else {

            if (!this.hasProfileIntersection(this.selectedProject.profiles, user.profiles)) {
                this.sharedService.showToast('Cet utilisateur ne possede pas les competances que votre projet cherche', 2000)
            }
            else {
                this.modalCtrl.create(
                    {
                        component: AddInterestComponent,
                        componentProps: {project: this.selectedProject, username: user.username, direction: 'ProjectToUser'},
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


    onUserView(user:AppUser){

        if(this.authenticated){
            let interests:Interest[]=[];
            if(this.getInterest(this.selectedProject.id,user.username,"UserToProject").length>0){
                let interest1:Interest=this.getInterest(this.selectedProject.id,this.currentUser.username,"UserToProject")[0];
                interests.push(interest1);

            }
            if(this.getInverseInterestByDetais(user.username,this.selectedProject.id,"UserToProject").length>0){
                let interest2:Interest=this.getInverseInterestByDetais(user.username,this.selectedProject.id,"UserToProject")[0];
                interests.push(interest2);
            }





            this.modalCtrl.create(
                {
                    component: UserViewComponent,
                    componentProps: {user: user, interests: interests},
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

    isProfileSelected(profile: Profile) {
        //console.log(this.selectedProject.profiles)
        return (this.selectedProfiles.some(x => x.id === profile.id))
    }

    resetUsersSearche() {
        this.loadedProfiles?.forEach( (element) => {
            if (this.selectedProject.profiles.some(x => x.id === element.id))
                document.getElementById(element.id).checked=true;
            else
                document.getElementById(element.id).checked=false;
        })
        //console.log(this.defaultCity)
        this.formSearch.patchValue({keyword: '', city: this.defaultCity})
        this.selectedProfiles=this.selectedProject.profiles.slice()
    }

    checkboxProfileClick($event, profile: Profile) {
        if($event.detail.checked){
            this.selectedProfiles.push(profile)
        }
       else{
            this.selectedProfiles = this.selectedProfiles.filter(obj => obj.id !== profile.id).slice();
        }
        //console.log(this.selectedProfiles)

    }
}
