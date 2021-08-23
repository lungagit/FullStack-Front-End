import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models';
import { Advert } from 'src/app/_models/advert';
import { City } from 'src/app/_models/city';
import { Province } from 'src/app/_models/province';
import { AuthenticationService, UserService } from 'src/app/_services';
import { AdvertService } from 'src/app/_services/advert.service';
import { ProvinceService } from 'src/app/_services/province.service';

@Component({
  selector: 'app-advert-details',
  templateUrl: './advert-details.component.html',
  styleUrls: ['./advert-details.component.scss']
})
export class AdvertDetailsComponent implements OnInit {
    user: User;
    errorMessage = '';
    advert: Advert | undefined;
    advertId: number;
    userId: number;
    authenticated: boolean;

    provincesSub: Subscription;
    provinces: Province[] = [];

    citySub: Subscription;
    cities: City[] = [];

    showloader: boolean;
    constructor(private route: ActivatedRoute,
                private authenticationService: AuthenticationService,
                private advertService: AdvertService,
                private provinceService: ProvinceService,
                private userService: UserService) {
      this.userId = 0;
      if (this.authenticationService.currentUserValue) { 
            this.authenticated = true;
        }
        else{
          this.authenticated = false;
        }
      //Gets all cities if id is 0
      this.citySub = this.provinceService.getCitiesForProvince(0)
            .pipe(first())
            .subscribe({
              next: cities => {
                this.cities = cities;
              }
            })

        this.provincesSub = this.provinceService.getAllProvinces()
          .pipe(first())
          .subscribe({
            next: provinces => {
              this.provinces = provinces;
            },
             error: err => this.errorMessage = err
        });

    }

    ngOnInit(): void {
        const param = this.route.snapshot.paramMap.get('id');
          if (param) {
            this.advertId = +param;
            this.getAdvert(this.advertId)
          }
          if(!this.advert){
            return;
          }
    }
    
    getAdvert(advertId: number): void{
    //set showloader to true to show loading div on view
    this.showloader = true;
    const source = timer(400);

    const subscribe = source.subscribe(      
      () => {
        this.showloader = false;
        this.advertService.getById(this.userId, advertId)
        .pipe(first())
        .subscribe({
          next: advert => {
            this.advert = advert;
            this.advert.province = this.provinces.find(prov => prov.id === this.advert.provinceId);
            this.advert.city = this.cities.find(city => city.id === this.advert.cityId);
            console.log("Advert: ",this.advert);
            this.getSeller(this.advert.userId);
          },
          error: err => this.errorMessage = err
        });
      }); 
    }

    getSeller(sellerId: number): void{
      this.userService.getUserById(sellerId)
          .pipe(first())
          .subscribe( user => {
            this.user = user;
            console.log("Seller: ",this.user);
      });
    }

    ngOnDestroy(): void {

      if(this.provincesSub){
        this.provincesSub.unsubscribe();
      }
      if(this.citySub){
        this.citySub.unsubscribe();
      }
    }
}
