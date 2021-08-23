import { Component, ElementRef, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { User } from '../_models';
import { Advert } from '../_models/advert';
import { City } from '../_models/city';
import { Province } from '../_models/province';
import { AuthenticationService } from '../_services';
import { AdvertService } from '../_services/advert.service';
import { AlertService } from '../_services/alert.service';
import { ProvinceService } from '../_services/province.service';
import { GenericValidator } from '../_shared/generic-validator';

@Component({
  selector: 'app-sell-a-house',
  templateUrl: './sell-a-house.component.html',
  styleUrls: ['./sell-a-house.component.scss']
})
export class SellAHouseComponent implements OnInit, OnDestroy {
    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
    currentUser: User;
    createAdvertForm: FormGroup;
    title: string;
    invalid: boolean = false;
    loading: boolean = false;
    submitted = false;
    error: string = '';
    advertId: number;
    userId: number;

    advertSub: Subscription;
    provincesSub: Subscription;
    provinceSub: Subscription;
    citiesSub: Subscription;

    provinces: Province[] = [];
    province: Province; 
    cities: City[] = [];
    city: City;
    advert: Advert;

    private genericValidator: GenericValidator;
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };

    constructor(private fb: FormBuilder,
                private route: ActivatedRoute,
                private router: Router,
                private advertService: AdvertService,
                private alertService: AlertService,
                private authenticationService: AuthenticationService,
                private provinceService: ProvinceService) {

        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
        this.userId = this.currentUser.id;          
        this.validationMessages = {
            headline: {
              required: 'Headline is required.',
              minlength: 'Headline must be at least 10 characters.',
              maxlength: 'Headline cannot exceed 100 characters.',
              pattern: 'Invalid Headline'
            },
            province: {
              required: 'Province is required.',
            },
            city: {
              required: 'City is required.',
            },       
            advertDetails: {
              required: 'Advert Detail is required.',
              minlength: 'Advert Detail must be at least 10 characters.',
              pattern: 'Invalid Advert Detail',
              maxlength: 'Advert Detail cannot exceed 1000 characters.',
            },
            price: {
              required: 'Price is required.',
              min: 'Price must be at least R10000.',
              pattern: 'Invalid price',
              max: 'Price cannot exceed R100000000.',
            },
        };
        // Define an instance of the validator for use with this form,
        // passing in this form's set of validation messages.
        this.genericValidator = new GenericValidator(this.validationMessages);

    }

    ngOnInit(): void {

      this.createAdvertForm = this.fb.group({
          headline: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100), 
                          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

          province: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

          city: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],

          advertDetails: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000), 
                            Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
                            
          price: ['', [Validators.required, Validators.min(10000), Validators.max(100000000),
                      Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]]
        })

      //Read the advert Id from the route parameter
      this.advertSub = this.route.paramMap.subscribe(
        params => {
          this.advertId = +params.get('id');
          
        }
      )
      
      this.provincesSub = this.provinceService.getAllProvinces()
          .pipe(first())
          .subscribe({
            next: provinces => {
              this.provinces = provinces;
              this.getAdvert(this.advertId);
            },
             error: err => this.error = err
        });
        
    }

    ngAfterViewInit(): void {
      // Watch for the blur event from any input element on the form.
      // This is required because the valueChanges does not provide notification on blur
      const controlBlurs: Observable<any>[] = this.formInputElements
        .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

      // Merge the blur event observable with the valueChanges observable
      // so we only need to subscribe once.
      merge(this.createAdvertForm.valueChanges, ...controlBlurs).pipe(
        debounceTime(700)
      ).subscribe(value => {
        this.displayMessage = this.genericValidator.processMessages(this.createAdvertForm);
      });
    }
    
    getAdvert(advertId: number): void {
    this.advertService.getById(this.userId, advertId)
        .pipe(first())
        .subscribe({
          next: (advert: Advert) =>  {

            this.displayAdvert(advert);
          },
          error: err => this.error = err
        });
    }

    displayAdvert(advert: Advert): void {
      
      this.advert = advert;

      if (this.advert.id === 0) {
        this.title = 'Add a Listing';
        
      } else {
        this.title = `Edit Listing: ${this.advert.headline}`;
        //Populate form with advert values
        this.province = this.provinces.find(prov => prov.id === this.advert.provinceId);
        
        this.citiesSub = this.provinceService.getCitiesForProvince(this.advert.provinceId)
                  .pipe(first())
                  .subscribe({
                    next: cities => {
                      this.cities = cities
                      this.city = this.cities.find(city => city.id === this.advert.id);
                      this.createAdvertForm.patchValue({

                            headline: this.advert.headline,
                            province: this.province,
                            city: this.city,
                            advertDetails: this.advert.advertDetails,
                            price: this.advert.price
                            
                          });
                      }
                  });
      }
      
    }

    onSubmit() {
        this.submitted = true;
        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.createAdvertForm.invalid) {
            this.invalid = true;
            return;
        }

        this.loading = true;
        if (this.advert.id === 0) {
            this.createAdvert();
        } else {
            this.updateAdvert();
        }
    }

    createAdvert(): void {
      
      this.advert = {
          headline: this.createAdvertForm.get('headline')?.value,
          provinceId: this.province.id,
          cityId: this.city.id,
          advertDetails: this.createAdvertForm.get('advertDetails')?.value,
          price: this.createAdvertForm.get('price')?.value,
          status: this.advert.status,
          hidden: this.advert.hidden,
          deleted: this.advert.deleted,
      }
      this.loading = true;
      this.advertService.createAdvert(this.userId, this.advert)
              .pipe(first())
              .subscribe(
                  data => {
                    this.alertService.success('Advert published successfully', { keepAfterRouteChange: true });
                    this.router.navigate(['/my-adverts']);
                    this.advert.province = this.province;
                  },
                  error => {

                      this.error = error;
                      this.loading = false;
                  });
      }
      
      private updateAdvert(): void {

        this.advert.headline = this.createAdvertForm.get('headline')?.value;
        this.advert.provinceId = this.province.id;
        this.advert.cityId = this.city.id,
        this.advert.advertDetails = this.createAdvertForm.get('advertDetails')?.value;
        this.advert.price = this.createAdvertForm.get('price')?.value;

        this.loading = true;
        this.advertService.updateAdvert(this.userId, this.advertId, this.advert)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['/my-adverts', { relativeTo: this.route }]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

    onSelcetedProvince(province: Province): void {
        this.province = province;

        if (!this.advert) return;
        else{
          this.citiesSub = this.provinceService.getCitiesForProvince(this.province.id)
                .pipe(first())
                .subscribe({
                  next: cities => {
                    this.cities = cities
                  }
                });
        }
      
    }

    onSelcetedCity(city: Province): void {
      this.city = city;
    }

    onCancel(): void{
      this.router.navigate(['/my-adverts']);
    }

    ngOnDestroy(): void {
      
    if(this.advertSub) {
      this.advertSub.unsubscribe();
    }

    if(this.provincesSub) {
      this.provincesSub.unsubscribe();
    }
    
    if(this.provinceSub) {
      this.provinceSub.unsubscribe();
    }

    if(this.citiesSub) {
      this.citiesSub.unsubscribe();
    }
  }
}
