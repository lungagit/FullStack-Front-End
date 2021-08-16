import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { User } from 'src/app/_models';
import { Advert } from 'src/app/_models/advert';
import { AuthenticationService } from 'src/app/_services';
import { AdvertService } from 'src/app/_services/advert.service';
import { AlertService } from 'src/app/_services/alert.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit, OnDestroy {
  currentUser: User;
  adverts: Advert[] = [];
  errorMessage: string = '';
  advertSub: Subscription;
  advertId: number;
  userId: number;
  constructor(public modalRef: MdbModalRef<ModalComponent>,
              private advertService: AdvertService,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private router: Router) {
  
    this.authenticationService.currentUser.subscribe(x =>  this.currentUser = x);
    this.userId = this.currentUser.id;
  }

  ngOnInit(): void {
    this.advertSub = this.advertService.getAllAdvertsForUser(this.userId)
          .pipe(first())
          .subscribe({
          next: adverts => {
            this.adverts = adverts;
        },
        error: err => this.errorMessage = err
      });
  }
  onContinue(){

    this.deleteAdvert(this.advertId);
    this.modalRef.close();

  }
  
  deleteAdvert(advertId: number) {
      this.alertService.clear();
      const advert = this.adverts.find(advert => advert.id === advertId);
      advert.status = 'DELETED';
      advert.deleted = true;
      this.advertService.updateAdvert(this.userId ,advertId, advert)
          .pipe(first())
            .subscribe(
                data => {
                    this.reloadCurrentRoute();
                    this.alertService.warn(advert.headline + ' deleted.');
                   
                },
                error => {
                    this.alertService.error(error);
                });
  }
  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
        this.router.navigate([currentUrl]);
    });
  }

  ngOnDestroy(): void{
    if(this.advertSub) {
      this.advertSub.unsubscribe();
    }
  }
}
