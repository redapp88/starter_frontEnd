import { Injectable } from '@angular/core';
import {AlertController, ModalController, Platform, ToastController} from '@ionic/angular';
import {environment} from '../../environments/environment';
import {Observable, Subject} from 'rxjs';
import {Interest} from '../models/Interest.model';
import {Localisation} from '../models/Localisation';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
    constructor(private alertCtrl: AlertController,
                private platform: Platform,
                private http: HttpClient,
                private authService:AuthService,
                private modalCtrl:ModalController,
                private toastCtrl:ToastController
                ) {
    }



    public showAlert(message: string) {

        if (message == null || message == '' || message.length == 0)
            message = 'erreur de connexion';
        else if (message === 'Unauthorized')
            message = `Nom d'utisateur ou mot de passe incorrect`;
        else if (message.includes('Maximum upload size exceeded'))
            message = 'Image trop volumeuse choisisez une photo de moin de 3 mb';

        //message=`${environment.backEndUrl}`+ message

        this.alertCtrl.create({header: 'Information', message: message, buttons: ['Ok']}).then(
            (alertEl => {
                alertEl.present()
            })
        )
    }

    public showToast(message:string,duration:number){
        this.toastCtrl.create({
            message: message, cssClass: 'ion-text-center'
            , duration: duration
        }).then(
            (toastEl) => {
                toastEl.present()
            }
        )
    }

    public loginSuccess() {
        this.authService.emitUser();
        this.modalCtrl.dismiss();
      /*  this.toastCtrl.create({
            message: 'Bienvenue ' + this.authService.curentUser.name, cssClass: 'ion-text-center'
            , duration: 3000
        }).then(
            (modalEL) => {
                modalEL.present()
            }
        )*/
    }



  /*  socialMediaShare(task: Task) {
        let navigator: any;
        navigator = window.navigator;

        let body: string = `Bonjour!Suivez l'avancement de votre travail:${task.title} sur l'App Tasker disponible sur PlayStore et AppStore avec votre code secret : ${task.id}`
        let sujet = 'Votre code Tasker';
        if(!this.platform.is('cordova')){
            navigator.share({
                'title': sujet,
                'text': body
            }).then(function () {
                console.log('Successful share');
            }).catch(function (error) {
                console.log('Error sharing:', error)
            });
        }


        else{
            this.socialSharing.share(body, sujet).then(() => {

            }).catch(() => {
                // Error!
            })
        }
    }*/
}