import {Component, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {AlertController, LoadingController, ModalController, ToastController} from '@ionic/angular';
import {UsersService} from '../services/users.service';
import {SharedService} from '../services/shared.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {


    constructor(private authService: AuthService,
                private router: Router,
                private loadingCtrl: LoadingController,
                private alertCtrl: AlertController,
                public toastCtrl: ToastController,
                private usersService: UsersService,
                private sharedService: SharedService,
                private modalCtrl: ModalController) {
    }

    form: FormGroup;

    ngOnInit() {

        this.form = new FormGroup({
                username: new FormControl('', {
                    updateOn: 'change',
                    validators: [Validators.required,
                        Validators.minLength(4)]
                }),
                password: new FormControl('', {
                    updateOn: 'change',
                    validators: [Validators.required,
                        Validators.minLength(6)]
                }),
            }
        )
    }


    onAction() {

        if (!(this.form.controls.username.valid && this.form.controls.password.valid)) {
            return;
        }
        const username = this.form.value['username'];
        const password = this.form.value['password'];
        this.login(username, password);

    }


    private login(username: string, password: string) {
        this.loadingCtrl.create({keyboardClose: true, spinner: 'lines', message: 'login...'}).then((loadingEL) => {
            loadingEL.present();
            this.authService.login(username, password).subscribe(
                () => {
                },
                (error) => {
                    console.log(error)
                    loadingEL.dismiss();

                    this.sharedService.showAlert(error.error.message)
                },
                () => {

                    loadingEL.dismiss();
                    this.modalCtrl.dismiss('','success')

                })
        })
    }


    loginValid() {
        return (this.form.controls.username.valid && this.form.controls.password.valid);
    }

    onGoForgetPassword() {

    }
}
