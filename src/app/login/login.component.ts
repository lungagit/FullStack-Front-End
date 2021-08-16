import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef  } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName  } from '@angular/forms';
import { GenericValidator } from '../_shared/generic-validator';
import { Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { AuthenticationService } from '../_services';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    loginForm: FormGroup;
    invalid: boolean = false;
    loading: boolean = false;
    submitted: boolean = false;
    error: string = '';
    
    private genericValidator: GenericValidator;
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };

    constructor(private router: Router,
                private fb: FormBuilder,
                private authenticationService: AuthenticationService) {
        
        this.validationMessages = {
        
            email: {
            required: 'Email is required.',
            email: 'Invalid email',
            },
            password: {
            required: 'Password is required.',
            pattern: 'Invalid password',
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

    ngOnInit():void {

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]]
        })
    }

    onLogin(): void{

        let email = this.loginForm.get('email')?.value;
        let password = this.loginForm.get('password')?.value;
        this.loading = true;
        this.authenticationService.login(email, password)
            .pipe(first())
            .subscribe(
                data => {
                    
                },
                error => {
                    this.error = error;
                    this.invalid = true;
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
        merge(this.loginForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(1000)
        ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.loginForm);

        });
    }
}
