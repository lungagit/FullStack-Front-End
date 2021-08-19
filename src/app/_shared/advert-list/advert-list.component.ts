import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { Advert } from 'src/app/_models/advert';
import { City } from 'src/app/_models/city';
import { Province } from 'src/app/_models/province';
import { AdvertService } from 'src/app/_services/advert.service';
import { ProvinceService } from 'src/app/_services/province.service';

@Component({
  selector: 'app-advert-list',
  templateUrl: './advert-list.component.html',
  styleUrls: ['./advert-list.component.scss']
})
export class AdvertListComponent implements OnInit, OnDestroy {
    userId: number;
    errorMessage: string = '';
    advertSub: Subscription;
    adverts: Advert[] = [];
    advert: Advert;

    provincesSub: Subscription;
    provinces: Province[] = [];

    citySub: Subscription;
    cities: City[] = [];
    showloader: boolean;

    constructor(private advertService: AdvertService,
                private provinceService: ProvinceService) {
      this.userId = 0;

      this.provincesSub = this.provinceService.getAllProvinces()
          .pipe(first())
          .subscribe({
            next: provinces => {
              this.provinces = provinces;
            },
             error: err => this.errorMessage = err
        });
      //Gets all cities if id is 0
      this.citySub = this.provinceService.getCitiesForProvince(0)
            .pipe(first())
            .subscribe({
              next: cities => {
                this.cities = cities;
              }
            })
     }

    ngOnInit(): void {
      this.getAdverts();
    }

    getAdverts(): void{
    // set showloader to true to show loading div on view
    this.showloader = true;
    const source = timer(800);

    const subscribe = source.subscribe(
      () => {
        this.showloader = false;
        this.advertSub = this.advertService.getAllAdvertsForUser(this.userId)
          .pipe(first())
          .subscribe({
            next: adverts => {
              this.adverts = adverts;
              for(let advert of this.adverts){
                  this.advert = advert;
                  this.advert.province = this.provinces.find(prov => prov.id === this.advert.provinceId);
                  this.advert.city = this.cities.find(city => city.id === this.advert.cityId);
                }

          },
          error: err => this.errorMessage = err
        });
      });
    }

    orderByHighPrice(): void{
      this.adverts = this.adverts.sort((n1, n2) => {
        if(n1.price < n2.price){
            return 1;
        }

        if(n1.price > n2.price){
          return -1;
        }
        return 0;
      });
    }

    orderByLowPrice(): void{
      this.adverts = this.adverts.sort((n1, n2) => {
        if(n1.price > n2.price){
            return 1;
        }

        if(n1.price < n2.price){
          return -1;
        }
        return 0;
      });
    }

    ngOnDestroy(): void {

      if(this.advertSub) {
        this.advertSub.unsubscribe();
      }
      if(this.provincesSub){
        this.provincesSub.unsubscribe();
      }
      if(this.citySub){
        this.citySub.unsubscribe();
      }
    }
}
