import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProjectsPageRoutingModule } from './projects-routing.module';

import { ProjectsPage } from './projects.page';
import {GeneralModule} from '../general.module';
import {LoginComponent} from '../login/login.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    IonicModule,
    ProjectsPageRoutingModule,
      GeneralModule

  ],
  declarations: [ProjectsPage],
    entryComponents:[]
})
export class ProjectsPageModule {}
