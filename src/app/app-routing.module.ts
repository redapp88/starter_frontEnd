import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {AuthGuardUsers} from './authGuards/authUsers.guard';

const routes: Routes = [
    {path: '', redirectTo: 'projects', pathMatch: 'full'},
    {path: 'projects', loadChildren: './projects/projects.module#ProjectsPageModule'},
    {path: 'users', loadChildren: './users/users.module#UsersPageModule', canLoad: [AuthGuardUsers]}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
