import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef  } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators, FormControlName  } from '@angular/forms';
import { GenericValidator } from '../_shared/generic-validator';
import { Router } from '@angular/router';

import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';
import { User } from '../_models';
import { AlertService } from '../_services/alert.service';

function passwordMatcher(c: AbstractControl): {[key: string]: | boolean}| null{
  let passwordControl = c.get('password');
  let confirmControl = c.get('confirmPassword');

  if(passwordControl.pristine || confirmControl.pristine){
    return null;
  } 
  
  if(passwordControl?.value === confirmControl?.value){
    return null;
  }
  return {'match': true};
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  user: User
  registerForm: FormGroup;
  invalid: boolean = false;
  loading: boolean = false;
  error: string = '';

  private genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertService: AlertService,
              private authenticationService: AuthenticationService) {

    this.validationMessages = {
        forenames: {
          required: 'Forenames are required.',
          minlength: 'Forenames must be at least 1 characters.',
          maxlength: 'Forenames cannot exceed 100 characters.',
          pattern: 'Invalid Name'
        },
        surname: {
          required: 'Last name is required.',
          minlength: 'Surname must be at least 3 characters.',
          maxlength: 'Surname cannot exceed 100 characters.',
          pattern: 'Invalid last name'
        },
        email: {
          required: 'Email is required.',
          email: 'Email address is invalid',
          minlength: 'Email must be at least 6 characters.',
          maxlength: 'Email cannot exceed 100 characters.',
        },       
        password: {
          required: 'Password is required.',
          minlength: 'Password must be at least 8 characters.',
          pattern: 'Invalid password',
          maxlength: 'Password cannot exceed 100 characters.',
        },
        confirmPassword: {
          required: 'Confirm the password.',
          minlength: 'Password must be at least 8 characters.',
          pattern: 'Invalid password',
          maxlength: 'Password cannot exceed 100 characters.',
        },
        passwordGroup: {
          match: 'Passwords do not match'
        },

    };
    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
    // redirect to my adverts if already logged in
    if (this.authenticationService.currentUserValue) { 
        this.router.navigate(['/my-adverts']);
    }
  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      forenames: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), 
                      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), 
                     Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
      passwordGroup: this.fb.group({

        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), 
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
                        
        confirmPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100),
                               Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]]
      }, {validators: passwordMatcher})
    })
  }

  onRegister(): void{
    // reset alerts on submit
    this.alertService.clear();

    if(this.registerForm.invalid){
      this.invalid = true;
      return;
    }

    this.user = {
        forenames: this.registerForm.get('forenames')?.value,
        surname: this.registerForm.get('surname')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('passwordGroup.password')?.value
    }

    this.loading = true;
    this.authenticationService.register(this.user)
            .pipe(first())
            .subscribe(
                data => {
                   this.alertService.success('Registration successful. Login', { keepAfterRouteChange: true });
                   this.router.navigate(['/login']);
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
    merge(this.registerForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.registerForm);

    });
  }
}
