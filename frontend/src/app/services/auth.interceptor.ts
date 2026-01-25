import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isValidToken(token: string | null): token is string {
    return !!token && token !== 'undefined' && token !== 'null' && token.trim().length > 0;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (typeof window === 'undefined' || !window.localStorage) {
      return next.handle(req);
    }

     if (req.headers.has('Authorization')) {
      return next.handle(req);
    }

    const token = localStorage.getItem('token');
    if (!this.isValidToken(token)) {
      return next.handle(req);
    }

    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next.handle(authReq);
  }
}
