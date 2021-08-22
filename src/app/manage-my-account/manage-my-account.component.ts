import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge, Subscription } from 'rxjs';
import { first, debounceTime } from 'rxjs/operators';
import { User } from '../_models';
import { AuthenticationService, UserService } from '../_services';
import { AlertService } from '../_services/alert.service';
import { GenericValidator } from '../_shared/generic-validator';

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
  selector: 'app-manage-my-account',
  templateUrl: './manage-my-account.component.html',
  styleUrls: ['./manage-my-account.component.scss']
})
export class ManageMyAccountComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  user: User;
  currentUser: User;
  userSub: Subscription;
  manageUserForm: FormGroup;
  currentPassForm: FormGroup;
  passwordComfirmed: boolean = false;
  passwordInValid: boolean;
  invalid: boolean = false;
  loading: boolean = false;
  submitted: boolean = false;
  error: string = '';
  confirmPasswordValidators = [Validators.minLength(8), Validators.maxLength(100),
                                Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)];
  private genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
              private router: Router,
              private alertService: AlertService,
              private authenticationService: AuthenticationService,
              private userService: UserService) {

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
    this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

    this.userService.getUserById(this.currentUser.id)
        .pipe(first())
        .subscribe( user => {
          this.user = user;
    })
    
  }

  ngOnInit(): void {
                   
    this.currentPassForm = this.fb.group({
            currentPassword: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]]
        });

    this.manageUserForm = this.fb.group({
      forenames: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100), 
                      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

      surname: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), 
                     Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
      passwordGroup: this.fb.group({

        password: ['', [Validators.minLength(8), Validators.maxLength(100), 
                        Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
                        
        confirmPassword: ['', this.confirmPasswordValidators]
      }, {validators: passwordMatcher})
    });
  }
  
  onContinue(){
    this.submitted = true;
    let enteredPass = this.currentPassForm.get('currentPassword')?.value;
    if(enteredPass !== this.user.password){
        this.passwordInValid = true;
    }
    else{
        this.passwordComfirmed = true;
        this.passwordInValid = false;
        this.currentPassForm.reset();
        this.manageUserForm.patchValue({
          forenames: this.user.forenames,
          surname: this.user.surname,
          email: this.user.email,
        })
    }
    
  }

  onUpdate(): void{
    // reset alerts on submit
    this.alertService.clear();

    if(this.manageUserForm.invalid){
      this.invalid = true;
      return;
    }
    this.user.forenames = this.manageUserForm.get('forenames')?.value;
    this.user.surname = this.manageUserForm.get('surname')?.value;
    this.user.email = this.manageUserForm.get('email')?.value;
    if(this.manageUserForm.get('passwordGroup.password')?.value !== ''){
        this.confirmPasswordValidators.push(Validators.required);
        this.user.password = this.manageUserForm.get('passwordGroup.password')?.value;
        if(this.manageUserForm.get('passwordGroup.confirmPassword')?.value === ''){
            this.invalid = true;
            return;
        }
    }
    this.loading = true;
    this.authenticationService.updatedUser(this.user.id, this.user)
            .pipe(first())
            .subscribe(
                data => {
                   this.alertService.success('Update successful', { keepAfterRouteChange: true });
                   this.manageUserForm.reset();
                   this.loading = false;
                   this.passwordComfirmed = false;
                   this.submitted = false;
                   this.router.navigate(['/manage-my-account']);
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
    merge(this.manageUserForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.manageUserForm);
    });
  }
}
