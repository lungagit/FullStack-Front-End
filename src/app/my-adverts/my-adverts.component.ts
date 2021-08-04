import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-my-adverts',
  templateUrl: './my-adverts.component.html',
  styleUrls: ['./my-adverts.component.scss']
})
export class MyAdvertsComponent implements OnInit {
  currentUser: User;
  constructor(private authenticationService: AuthenticationService,) {
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
   }

  ngOnInit(): void {
  }

}
