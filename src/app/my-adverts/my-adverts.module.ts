import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { MyAdvertsComponent } from './my-adverts.component'
import { AuthGuard } from '../_helpers/auth.guard';
import { AuthHeaderComponent } from '../_shared/auth-header/auth-header.component';
import { SellAHouseComponent } from '../sell-a-house/sell-a-house.component';
import { BuyAHouseComponent } from '../buy-a-house/buy-a-house.component';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { DeleteModalComponent } from '../_shared/delete-modal/delete-modal.component';
import { SharedModule } from '../_shared/shared.module';
import { ManageMyAccountComponent } from '../manage-my-account/manage-my-account.component';
import { SellerProfileComponent } from '../seller-profile/seller-profile.component';


@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MyAdvertsComponent,
    AuthHeaderComponent,
    SellAHouseComponent,
    BuyAHouseComponent,
    DeleteModalComponent,
    SellerProfileComponent,
    ManageMyAccountComponent

  ],
  imports: [
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'my-adverts', component: MyAdvertsComponent, canActivate: [AuthGuard]},
      {path: 'sell-a-house', component: SellAHouseComponent, canActivate: [AuthGuard]},
      {path: 'sell-a-house/:id/edit', component: SellAHouseComponent, canActivate: [AuthGuard]},
      {path: 'buy-a-house', component: BuyAHouseComponent, canActivate: [AuthGuard]},
      {path: 'manage-my-account', component: ManageMyAccountComponent, canActivate: [AuthGuard]},
      {path: 'seller-profile', component: SellerProfileComponent, canActivate: [AuthGuard]}

    ]),
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
  ]
})
export class MyAdvertsModule { }
