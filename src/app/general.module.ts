import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './login/login.component';
import {UserProgramsComponent} from './shared/user-programs/user-programs.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {AddInterestComponent} from './shared/add-interest/add-interest.component';
import {ProjectViewComponent} from './projects/project-view/project-view.component';
import {UserViewComponent} from './users/user-view/user-view.component';

@NgModule({
    declarations: [UserProgramsComponent,
        LoginComponent,
        AddInterestComponent,
        ProjectViewComponent,
        UserViewComponent],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
    ],

    entryComponents: [
        UserProgramsComponent,
        LoginComponent,
        AddInterestComponent,
        ProjectViewComponent,
        UserViewComponent
    ]
})
export class GeneralModule {
}
