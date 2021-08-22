import { Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription, Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';
import { AlertService } from '../_services/alert.service';
import { GenericValidator } from '../_shared/generic-validator';

@Component({
  selector: 'app-seller-profile',
  templateUrl: './seller-profile.component.html',
  styleUrls: ['./seller-profile.component.scss']
})
export class SellerProfileComponent implements OnInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  user: User;
  currentUser: User;
  userSub: Subscription;
  sellerProfileForm: FormGroup;
  currentPassForm: FormGroup;
  passwordComfirmed: boolean = false;
  passwordInValid: boolean;
  invalid: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  error: string = '';

  private genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  constructor(private fb: FormBuilder,
              private router: Router,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
    
    this.validationMessages = {
        
        email: {
          required: 'Email is required.',
          email: 'Email address is invalid',
          minlength: 'Email must be at least 6 characters.',
          maxlength: 'Email cannot exceed 100 characters.',
        },      
        phoneNumber: {
          minLength: 'Phone number must be at least 6 digits long',
          maxlength: 'Phone number cannot exceed 30 digits'
        }
    };

   
    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

  }

  ngOnInit(): void {
    
    this.sellerProfileForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
      phoneNumber: ['', [Validators.minLength(6), Validators.maxLength(30)]]     
    });

    this.userService.getUserById(this.currentUser.id)
        .pipe(first())
        .subscribe( user => {
          this.user = user;
          this.sellerProfileForm.patchValue({
            email: this.user.email,
            phoneNumber: this.user.phoneNumber
          })

    });

  }

  onSubmit(): void{

    if(this.sellerProfileForm.invalid){
      this.invalid = true;
      return;
    }
    this.loading = true;
    this.user.email = this.sellerProfileForm.get('email')?.value;
    if(this.sellerProfileForm.get('phoneNumber')?.value !== ''){
        this.user.phoneNumber = this.sellerProfileForm.get('phoneNumber')?.value;
    }

    this.authenticationService.updatedUser(this.user.id, this.user)
            .pipe(first())
            .subscribe(
                data => {
                   this.alertService.success('Update successful', { keepAfterRouteChange: true });
                   this.sellerProfileForm.reset();
                   this.loading = false;
                   this.router.navigate(['/seller-profile']);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });

  }
  
  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.sellerProfileForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.sellerProfileForm);
    });
  }
}

