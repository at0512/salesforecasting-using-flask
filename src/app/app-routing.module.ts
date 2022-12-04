import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadComponent } from './upload/upload.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginpagecompComponent } from './loginpagecomp/loginpagecomp.component';

const routes: Routes = [ 
  {path: '', component: LoginpagecompComponent},
  {path: 'upload', component: UploadComponent},
  {path: 'dashboard', component: DashboardComponent},
  {path: '**', redirectTo: '/'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
