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
      const req = request.clone(
        {
          setHeaders:{
            Authorization:auth.authorization,
            userId: auth.userId
          }
        });
      // req.headers.append("Authorization", auth.authorization);

    return next.handle(req);
  }
}
