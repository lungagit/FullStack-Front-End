import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
        //window.localStorage.clear();
        this.router.navigate(['./login']);
    }
    //forenames: string, surname: string, email: string, password: string
    register(user: User) {
        return this.http.post<JSON>(`${environment.apiUrl}/users/register`, user);
    }
}