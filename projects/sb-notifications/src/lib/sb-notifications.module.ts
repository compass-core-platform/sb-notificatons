import { ModuleWithProviders, NgModule } from '@angular/core';
import { SbNotificationsComponent } from './sb-notifications.component';
import { NotificationListComponent } from './components/notification-list/notification-list.component';
import { CreateNotificationComponent } from './components/create-notification/create-notification.component';
import { NotificationService } from '../public-api';
import { MatTabsModule } from '@angular/material/tabs'
import { MatTableModule }  from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ImageUploadDirective } from './shared/directives/image-upload.directive';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { AudienceListComponent } from './components/audience-list/audience-list.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NotificationInterceptor } from './shared/services/notification.interceptor';
import { CommonModule } from '@angular/common';
import {MatSnackBarModule} from '@angular/material/snack-bar';

import { NotificationPreviewComponent } from './components/notification-preview/notification-preview.component';

@NgModule({
  declarations: [
    SbNotificationsComponent,
    NotificationListComponent,
    CreateNotificationComponent,
    SearchFilterComponent,
    ImageUploadDirective,
    AudienceListComponent,
    NotificationPreviewComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTabsModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
    MatListModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  providers: [
    { 
      provide: HTTP_INTERCEPTORS, useClass: NotificationInterceptor, multi:true
    }
  ],
  exports: [
    SbNotificationsComponent,
    NotificationListComponent,
    CreateNotificationComponent
  ]
})
export class SbNotificationsModule { 
  static forRoot(configuration: any): ModuleWithProviders<SbNotificationsModule> {
    return {
      ngModule: SbNotificationsModule,
      providers: [NotificationService, {provide: 'config', useValue: configuration}]
    };
  }
}
