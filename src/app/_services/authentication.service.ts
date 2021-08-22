import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../_models';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient,
                private router: Router) {
                    
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                this.router.navigate(['/my-adverts']);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        window.localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        window.localStorage.clear();
        this.router.navigate(['./login']);
    }

    register(user: User) {
        return this.http.post<JSON>(`${environment.apiUrl}/users/register`, user);
    }

    updatedUser(userId: number, user: User){
        return this.http.put<User>(`${environment.apiUrl}/users/${userId}`, user)
            .pipe(map(x=> {
                if(userId == this.currentUserValue.id){
                    const userr = {...this.currentUserValue, ...user}
                    localStorage.setItem('currentUser', JSON.stringify(userr));

                    this.currentUserSubject.next(userr);

                }
                return x;
            }),
                catchError(this.handleError)
        );
    }
    
    private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
        // A client-side or network error occurred. Handle it accordingly.
        errorMessage = `An error occurred: ${err.error.message}`;
        } else {
        // The backend returned an unsuccessful response code.
        // The response body may contain clues as to what went wrong,
        errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
        }
    return throwError(errorMessage);
    }
}