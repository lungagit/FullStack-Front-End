import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { MyAdvertsComponent } from './my-adverts.component'
import { HeaderComponent } from '../header/header.component';
import { AuthGuard } from '../_helpers/auth.guard';
import { FooterComponent } from '../footer/footer.component';
import { AuthHeaderComponent } from '../_shared/auth-header/auth-header.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    MyAdvertsComponent,
    HeaderComponent,
    FooterComponent,
    AuthHeaderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      {path: 'login', component: LoginComponent},
      {path: 'register', component: RegisterComponent},
      {path: 'my-adverts', component: MyAdvertsComponent, canActivate: [AuthGuard]}
    ]),
  ]
})
export class MyAdvertsModule { }
