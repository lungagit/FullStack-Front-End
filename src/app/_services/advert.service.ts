import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subscription, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Advert } from '../_models/advert';
import { Province } from '../_models/province';
import { ProvinceService } from './province.service';


@Injectable({
  providedIn: 'root'
})
export class AdvertService {

    constructor(private http: HttpClient){}
    
    getAllAdvertsForUser(userId: number): Observable<Advert[]> {
        return this.http.get<Advert[]>(`${environment.apiUrl}/users/${userId}/adverts`)
            .pipe(
                catchError(this.handleError)
            );
    }
    getById(userId: number, advertId: number): Observable<Advert> {

        if (advertId === 0) {
            return of(this.initializeAdvert());
        }

        return this.http.get<Advert>(`${environment.apiUrl}/users/${userId}/adverts/${advertId}`)
            .pipe(
                catchError(this.handleError)
            );
    }
    createAdvert(userId: number, advert: Advert): Observable<Advert>{
        return this.http.post<Advert>(`${environment.apiUrl}/users/${userId}/adverts`, advert)
            .pipe(
                catchError(this.handleError)
            );
    }
    updateAdvert(userId: number, advertId: number, advert: Advert): Observable<Advert> {
        return this.http.put<Advert>(`${environment.apiUrl}/users/${userId}/adverts/${advertId}`, advert)
            .pipe(
                catchError(this.handleError)
            );
    }
    //unused
    deleteAdvert(id: number): Observable<{}> {
        return this.http.delete(`${environment.apiUrl}/adverts/${id}`)
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

    private initializeAdvert(): Advert {
        return{
            id: 0,
            headline: null,
            provinceId: null,
            cityId: null,
            advertDetails: null,
            price: null,
            status: 'LIVE',
            hidden: false,
            deleted: false,
        };
    }
}
