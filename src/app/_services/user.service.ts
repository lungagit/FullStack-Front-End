import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../_models';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthenticationService } from '../_services';
@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient,
                private authenticationService: AuthenticationService) { }

    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`)
            .pipe(
                catchError(this.handleError)
            );
    }

    getUserById(userId: number): Observable<User>{
        return this.http.get<User>(`${environment.apiUrl}/users/${userId}`)
            .pipe(
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