import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { CompareService } from './compare.service';
import { RentalService } from 'app/rentals/rental.service';

import UsersF from 'app/models/usersf';
import RentalG from 'app/models/rental';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html'
})
export class CompareComponent implements OnInit{

  userFavs : UsersF;
  userFavRentals : RentalG[] = [];

  compareForm = new FormGroup({
    rentChecked : new FormControl(null),
    distanceChecked : new FormControl(null),
    familyPrefChecked : new FormControl(null),
    foodPrefChecked : new FormControl(null),
    expectedAvailabilityChecked : new FormControl(null),
    ownerContactChecked : new FormControl(null),
  });

  constructor(private compareService: CompareService,
              private rentalService: RentalService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.compareService.getUserF(userData.email).subscribe(
      (userfData) => {
        this.userFavs = userfData[0];
        for (let index = 0; index < this.userFavs.favourite_rentals.length; index++) {
          this.rentalService.getList(this.userFavs.favourite_rentals[index]).subscribe(
            (rental) => {
            this.userFavRentals.push(rental[0]);
            } 
          );
        }
        this.compareForm = new FormGroup({
          rentChecked : new FormControl(this.userFavs.parameters["rent"]),
          distanceChecked : new FormControl(this.userFavs.parameters["distance"]),
          familyPrefChecked : new FormControl(this.userFavs.parameters["family_preference"]),
          foodPrefChecked : new FormControl(this.userFavs.parameters["food_preference"]),
          expectedAvailabilityChecked : new FormControl(this.userFavs.parameters["expected_availability"]),
          ownerContactChecked : new FormControl(this.userFavs.parameters["owner_contact"]),
        });
      }
    );
  }

  onSubmit() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    this.compareService.setParameters(userData.email, this.compareForm.value).subscribe(
      (data : UsersF) => {
        this.compareForm.value.rentChecked = data.parameters["rent"];
        this.compareForm.value.distanceChecked = data.parameters["distance"];
        this.compareForm.value.familyPrefChecked = data.parameters["family_preference"];
        this.compareForm.value.foodPrefChecked = data.parameters["food_preference"];
        this.compareForm.value.expectedAvailabilityChecked = data.parameters["expected_availability"];
        this.compareForm.value.ownerContactChecked = data.parameters["owner_contact"];

        // this.router.navigate(['../'], {relativeTo: this.route});
        window.location.reload();
      } 
    );
  }
}