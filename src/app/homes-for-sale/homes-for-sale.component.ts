import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { AuthenticationService } from '../_services';
import { ModalComponent } from '../_shared/modal/modal.component';

@Component({
  selector: 'app-homes-for-sale',
  templateUrl: './homes-for-sale.component.html',
  styleUrls: ['./homes-for-sale.component.scss']
})
export class HomesForSaleComponent implements OnInit {
  modalRef: MdbModalRef<ModalComponent>;
  modalOpend: boolean = false;
  constructor(private router: Router,
              private authenticationService: AuthenticationService,
              private modalService: MdbModalService) {

        // redirect to buy a house if already logged in
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/buy-a-house']);
        }
               }

  ngOnInit(): void {
  }
  
  onLogout() {
        this.authenticationService.logout();
  }

  openModal() {

    if (this.authenticationService.currentUserValue) { 
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

}
