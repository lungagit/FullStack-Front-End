import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { City } from '../_models/city';
import { Province } from '../_models/province';
import { AuthenticationService } from '../_services';
import { AdvertService } from '../_services/advert.service';
import { ProvinceService } from '../_services/province.service';
import { ModalComponent } from '../_shared/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit , OnDestroy{

    modalRef: MdbModalRef<ModalComponent>;
    modalOpend: boolean = false;
    //Get provinces and Cities at startup
    provincesSub: Subscription;
    provinces: Province[] = [];

    citySub: Subscription;
    cities: City[] = [];

    errorMessage: string = '';

    constructor(private authenticationService: AuthenticationService,
                private modalService: MdbModalService,
                private router: Router,
                private provinceService: ProvinceService) {}

    ngOnInit(): void {
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
    onLogout() {
          this.authenticationService.logout();
    }

    openModal() {
        
      if(this.authenticationService.currentUserValue) { 
            this.router.navigate(['/my-adverts']);
            return;
      }

      if(this.modalOpend === false){
        this.modalRef = this.modalService.open(ModalComponent);
        this.modalOpend = true;
      }

      else{
        this.modalRef.close();
        this.modalOpend = false;
        
      }
      
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
