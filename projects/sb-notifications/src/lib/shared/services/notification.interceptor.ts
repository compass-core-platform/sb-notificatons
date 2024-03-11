import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationInterceptor implements HttpInterceptor {

  constructor(private notificationService: NotificationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const auth = this.notificationService.configuration;
      if(!auth){
         const blankReq = request.clone(
          {
            setHeaders:{
              Authorization: '',
              userId: auth.userId
            }
          });
        return next.handle(blankReq);
      } 
      const req = request.clone(
        {
          setHeaders:{
            Authorization: 'Bearer '+auth.authorization,
            userId: auth.userId
          }
        });
    return next.handle(req);
  }
}
