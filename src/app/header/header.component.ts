import { Component, OnInit } from '@angular/core';
import { User } from '../_models';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  username: string;
  constructor(private authenticationService: AuthenticationService) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    this.username = this.currentUser.forenames;
  }

  ngOnInit(): void {
  }
  onLogout(): void {
        this.authenticationService.logout();
  }


}
