import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Observable, fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { User } from 'src/app/_models';
import { AlertService } from 'src/app/_services/alert.service';
import { GenericValidator } from '../generic-validator';

@Component({
  selector: 'app-contact-seller',
  templateUrl: './contact-seller.component.html',
  styleUrls: ['./contact-seller.component.scss']
})
export class ContactSellerComponent implements OnInit,AfterViewInit {
  @Input() user: User;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  invalid: boolean = false;
  contactSellerForm: FormGroup;
  private genericValidator: GenericValidator;
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };

  constructor(private fb: FormBuilder,
              private alertService: AlertService) {

    this.validationMessages = {
        name: {
          required: 'Name are required.',
          minlength: 'Names must be at least 5 characters.',
          maxlength: 'Names cannot exceed 100 characters.',
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
        phoneNumber: {
          maxlength: 'Phone number cannot exceed 100 digits'
        },
        message: {
          required: 'Message is required.',
          minLength: 'Message must be at least 10 characters.',
          maxLength: 'Message cannot exceed 200 characters.'
        }
    };
    // Define an instance of the validator for use with this form,
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
   }

  ngOnInit(): void {

    this.contactSellerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100), 
                      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      email: ['', [Validators.required, Validators.email, Validators.minLength(6), Validators.maxLength(100)]],
      phoneNumber: ['',[Validators.maxLength(100), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

      message: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200), 
                      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    });
  }
  onSendMessage(): void{
    if(this.contactSellerForm.invalid){
      this.invalid = true;
      return;
    }
    this.contactSellerForm.reset();
    this.alertService.success('Message sent');
  }
  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    // This is required because the valueChanges does not provide notification on blur
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));
 
    // Merge the blur event observable with the valueChanges observable
    // so we only need to subscribe once.
    merge(this.contactSellerForm.valueChanges, ...controlBlurs).pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.contactSellerForm);
    });
  }
}
