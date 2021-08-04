import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { User } from '../_models';
import { AuthenticationService } from '../_services';
import { ModalComponent } from '../_shared/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    modalRef: MdbModalRef<ModalComponent>;
    modalOpend: boolean = false;
    constructor(private authenticationService: AuthenticationService,
                private modalService: MdbModalService,
                private router: Router) {

    }

    ngOnInit(): void {
      //this.authenticationService.isAuthenticated = false;
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
}
