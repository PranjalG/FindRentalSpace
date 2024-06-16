import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RentalService } from '../rental.service';
import { ActivatedRoute, Router } from '@angular/router';
import Rental from 'app/models/rental';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rental-new',
  templateUrl: './rental-new.component.html',
  styleUrls: ['./rental-new.component.css']
})
export class RentalNewComponent {

  rental : Rental;
  error: String = null;

  newRentalForm: FormGroup = new FormGroup({
    owner : new FormControl(''),
    owner_contact : new FormControl(null),
    distance : new FormControl(null),
    city : new FormControl(''),
    type : new FormControl(''),
    address : new FormControl(''),
    landmark : new FormControl(''),
    family_preference : new FormControl(''),
    food_preference : new FormControl(''),
    expected_availability : new FormControl(''),
    refree : new FormControl(''),
    refree_contact : new FormControl(null),
    comments : new FormControl(''),
    rent : new FormControl(''),
    last_update : new FormControl(''),
    bedroom_type : new FormControl(''),
    image_path : new FormControl(''),
    created_by: new FormControl('')
  });

    constructor(private rentalService: RentalService,
                private router: Router,
                private route: ActivatedRoute,
                private toastr: ToastrService) {}

    onSubmit() {
      const userData = JSON.parse(localStorage.getItem('userData')); 
      this.newRentalForm.value.created_by = userData.email;

      if(!this.newRentalForm.valid){
        this.error = "This form contains invalid input.";
      } else {
        this.rentalService.addNewRental(this.newRentalForm.value).subscribe({
          next: (rentalData: Rental) => {
            this.rental = rentalData;
            this.router.navigate(['../rental-spaces']);
            this.toastr.success("Saved successfully!");
        }, 
          error: (err) => {
            console.log(err);
            this.error = err;
        }
      });
    }
    }

    onHandleError() {
      this.error = null;
    }

    onCancel() {
      this.router.navigate(['../'], {relativeTo: this.route});
      this.toastr.warning("No data saved!");
    }
}
