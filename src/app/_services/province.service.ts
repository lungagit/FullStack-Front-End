import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { City } from '../_models/city';
import { Province } from '../_models/province';

@Injectable({
  providedIn: 'root'
})
export class ProvinceService {

  constructor(private http: HttpClient) { }


    getAllProvinces(): Observable<Province[]> {
        return this.http.get<Province[]>(`${environment.apiUrl}/provinces`)
            .pipe(
                catchError(this.handleError)
            );
    }
    getProvinceById(provinceId: number): Observable<Province> {
        return this.http.get<Province>(`${environment.apiUrl}/provinces/${provinceId}`)
            .pipe(
                catchError(this.handleError)
            );
    }
    getProvinceByName(provinceName: string): Observable<Province> {
        return this.http.get<Province>(`${environment.apiUrl}/provinces/${provinceName}`)
            .pipe(
                catchError(this.handleError)
            );
    }
    getCitiesForProvince(provinceId: number): Observable<City[]> {
        return this.http.get<City[]>(`${environment.apiUrl}/provinces/${provinceId}/cities`)
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
