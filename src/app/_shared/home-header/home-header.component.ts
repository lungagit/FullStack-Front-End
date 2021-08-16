import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
;
import { AuthenticationService } from 'src/app/_services';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  styleUrls: ['./home-header.component.scss']
})
export class HomeHeaderComponent implements OnInit {
  
  modalRef: MdbModalRef<ModalComponent>;
  modalOpend: boolean = false;
  
  constructor(private authenticationService: AuthenticationService,
              private modalService: MdbModalService,
              private router: Router) { }

  ngOnInit(): void {
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
