import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdvertListComponent } from './advert-list/advert-list.component';
import { AdvertDetailsComponent } from './advert-details/advert-details.component';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { HomeHeaderComponent } from './home-header/home-header.component';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { ContactSellerComponent } from './contact-seller/contact-seller.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    AdvertListComponent,
    HeaderComponent,
    AdvertDetailsComponent,
    FooterComponent,
    HomeHeaderComponent,
    ContactSellerComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path: 'buy-a-house/:id', component: AdvertDetailsComponent}
    ]),
    MdbCollapseModule,
    MdbDropdownModule,
  ],
  exports: [
    AdvertListComponent,
    HeaderComponent,
    CommonModule,
    FooterComponent,
    HomeHeaderComponent,
    ContactSellerComponent,
    AlertComponent
  ]
})
export class SharedModule { }
