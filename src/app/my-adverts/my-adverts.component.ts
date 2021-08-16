import { Component, OnDestroy, OnInit } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { Subscription, timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { Advert } from '../_models/advert';
import { AuthenticationService } from '../_services';
import { AdvertService } from '../_services/advert.service';
import { AlertService } from '../_services/alert.service';
import { DeleteModalComponent } from '../_shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.scss']
})
export class MyAdvertsComponent implements OnInit, OnDestroy {
    modalRef: MdbModalRef<DeleteModalComponent>;
    currentUser: User;
    userId: number;
    errorMessage: string = '';
    advertSub: Subscription;
    adverts: Advert[] = [];
    showloader: boolean;
    
    constructor(private authenticationService: AuthenticationService,
                private modalService: MdbModalService,
                private advertService: AdvertService,
                private alertService: AlertService) {
      this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
      this.userId = this.currentUser.id;
    }

    ngOnInit(): void {
      this.setTimer();
      this.advertSub = this.advertService.getAllAdvertsForUser(this.userId)
          .pipe(first())
          .subscribe({
            next: adverts => {
              this.adverts = adverts;
          },
          error: err => this.errorMessage = err
      });
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
    
    setTimer(): void{
    // set showloader to true to show loading div on view
    this.showloader = true;
    const source = timer(5000);

    const subscribe = source.subscribe(      
      () => {
        this.showloader = false;
      }); 
    }

    ngOnDestroy(): void {
      
      if(this.advertSub) {
        this.advertSub.unsubscribe();
      }
    }
}
