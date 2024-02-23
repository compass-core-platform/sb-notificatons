import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateNotificationComponent, NotificationListComponent } from 'sb-notifications';

const routes: Routes = [
  {path:'', redirectTo:'/admin-portal/custom-notification', pathMatch:'full'},
  {path:'admin-portal/custom-notification', component:NotificationListComponent},
  {path:'admin-portal/custom-notification/create', component: CreateNotificationComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
