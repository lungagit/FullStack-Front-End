import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../_models';
import { AuthenticationService } from '../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currentUser: User;
  constructor(private router: Router,
              private authenticationService: AuthenticationService) {

    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit(): void {
  }
  onLogout() {
        this.authenticationService.logout();
        this.router.navigate(['/home']);
    }

}
