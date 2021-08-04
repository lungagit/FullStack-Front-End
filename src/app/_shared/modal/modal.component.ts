import { Component, OnInit } from '@angular/core';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';
import { AuthenticationService } from 'src/app/_services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  constructor(public modalRef: MdbModalRef<ModalComponent>,
              private authenticationService: AuthenticationService,
              private router: Router ) {}

  ngOnInit(): void {
  }

}
