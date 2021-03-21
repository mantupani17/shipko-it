import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent, HttpResponse } from "@angular/common/http";
import { Observable } from "rxjs";
import { UserService } from '../services/user.service';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { tap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.headers.get('No-Auth') == "True") {
            // return next.handle(req.clone());
            const clonedreq = req.clone();
            return next.handle(clonedreq).pipe(tap(
                    event => this.handleResponse(clonedreq, event),
                    error => this.handleError(clonedreq, error)
                )
            );
        }
        
        if (localStorage.getItem('userToken') != null) {
            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", "Bearer " + localStorage.getItem('userToken'))
            });
            return next.handle(clonedreq).pipe(tap(
                    event => this.handleResponse(clonedreq, event),
                    error => this.handleError(clonedreq, error)
                )
            );
        }
        else {
            this.router.navigateByUrl('/login');
        }
    }

    handleResponse(req: HttpRequest<any>, event) {
        // console.log('Handling response for ', req.url, event);
        if (event instanceof HttpResponse) {
        //   console.log('Request for ', req.url,
        //       ' Response Status ', event.status,
        //       ' With body ', event.body);
        // here we can handle the response
        }
    }
    
    handleError(req: HttpRequest<any>, event) {
        // console.error('Request for ', req.url,
        //     ' Response Status ', event.status,
        //     ' With error ', event.error);
        // here we are handling the request apis 
        if (event.status === 401) {
            this.router.navigateByUrl('/login');
        } else if(event.status === 403) {
            this.router.navigateByUrl('/login');
        }
    }
}

