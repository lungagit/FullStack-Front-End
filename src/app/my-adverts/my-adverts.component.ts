import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Subscription, timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { Advert } from '../_models/advert';
import { City } from '../_models/city';
import { Province } from '../_models/province';
import { AuthenticationService } from '../_services';
import { AdvertService } from '../_services/advert.service';
import { AlertService } from '../_services/alert.service';
import { ProvinceService } from '../_services/province.service';
import { DeleteModalComponent } from '../_shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.scss']
})
export class MyAdvertsComponent implements OnInit, AfterViewInit, OnDestroy {
    
    modalRef: MdbModalRef<DeleteModalComponent>;
    currentUser: User;
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
    constructor(private authenticationService: AuthenticationService,
                private modalService: MdbModalService,
                private advertService: AdvertService,
                private alertService: AlertService,
                private provinceService: ProvinceService) {

      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      this.userId = this.currentUser.id;
      
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
     
        this.getAdverts();
    }
    ngAfterViewInit():void{
       
    }
    getProvince(provinceId: number): void{

      this.provinceService.getProvinceById(provinceId)
          .pipe(first())
          .subscribe({
            next: province => {
              this.advert.province = province;
            },
            error: err => this.errorMessage = err
          })
    }

    onHideAdvert(advertId: number){
      this.alertService.clear();
      const advert = this.adverts.find(advert => advert.id === advertId);
      advert.status = 'HIDDEN';
      advert.hidden = true;

      this.advertService.updateAdvert(this.userId ,advertId, advert)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.warn(advert.headline + ' now hidden.', { keepAfterRouteChange: true });
                },
                error => {
                    this.alertService.error(error);
                });
    }

    onShowAdvert(advertId: number){
      this.alertService.clear();
      const advert = this.adverts.find(advert => advert.id === advertId);
      advert.status = 'LIVE';
      advert.hidden = false;
      this.advertService.updateAdvert(this.userId ,advertId, advert)
          .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success(advert.headline +' now visible.', { keepAfterRouteChange: true });
                },
                error => {
                    this.alertService.error(error);
                });
    }

    openModal(advertId: number): void {

      this.modalRef = this.modalService.open(DeleteModalComponent, {data: { advertId }});
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
