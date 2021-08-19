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

@NgModule({
  declarations: [
    AdvertListComponent,
    HeaderComponent,
    AdvertDetailsComponent,
    FooterComponent,
    HomeHeaderComponent,
  ],
  imports: [
    CommonModule,
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
  ]
})
export class SharedModule { }
