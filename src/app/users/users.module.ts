import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsersPageRoutingModule } from './users-routing.module';

import { UsersPage } from './users.page';
import {GeneralModule} from '../general.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
      ReactiveFormsModule,
    IonicModule,
    UsersPageRoutingModule,
      GeneralModule
  ],
  declarations: [UsersPage]
})
export class UsersPageModule {}
