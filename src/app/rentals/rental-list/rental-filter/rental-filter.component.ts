import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import Rental from 'app/models/rental';
import { RentalService } from 'app/rentals/rental.service';

@Component({
  selector: 'app-rental-filter',
  templateUrl: './rental-filter.component.html'
})
export class RentalFilterComponent implements OnInit, OnDestroy {
  rentals : Rental[] = [];
  rentalFilteredSet;
  subscription : Subscription;
  id: string;
  error: String = null;

  pageNumber = 0;
  distance = 8;
  rent = 15;

  dataLength = 1;
  numberOfPages = 1;

  value;
  filterApplied: boolean = false;

  expec_avail : string = '';

  filterForm: FormGroup = new FormGroup({
    type : new FormControl(''),
    btype : new FormControl(''),
    famPref : new FormControl(''),
    foodPref : new FormControl(''),
    expecAvail : new FormControl(this.expec_avail),
    distMark : new FormControl(8),
    rentMark : new FormControl(15000)
  });

  constructor(private rentalService: RentalService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.rentalService.rentalsChangedNew.subscribe({
      next: (rentalsData: Rental[]) => {
        this.rentals = rentalsData;
      }, 
      error: (err) => {
        this.error = err;
      }
    });
  }

  onTypeChange(value){
    if(value == "Other") {
      value = 'st';
      this.filterForm.value.type = value
    }
    else this.filterForm.value.type = value;
 }

  onBtypeChange(value){
   this.filterForm.value.btype = value.substring(0, 1);
  }

  onFamilyPrefChange(value){
    this.filterForm.value.famPref = value;
  }

  onFoodPrefChange(value){
    this.filterForm.value.foodPref = value;
  }

  onDistChange(value) {
    this.distance = value;
    this.filterForm.value.distMark = +value;
  }

  onRentChange(value) {
    this.rent = value;
    this.filterForm.value.rentMark = (+value)*1000;
  }

  onExpecAvailChange(value) {
    this.expec_avail = value;
    this.filterForm.value.expecAvail = value;
  }

  onSubmitFilters() {
    this.filterApplied = true;
    this.router.navigate(['filter'], {relativeTo: this.route});
    return this.rentalService.getListFiltered(this.filterForm.value).subscribe({
      next: (rentalsData: Rental[]) => {
        this.rentals = rentalsData;
        this.dataLength = rentalsData.length;
        this.numberOfPages = Math.trunc(this.dataLength/12) + 1;
        this.rentalFilteredSet = this.rentals.slice(0,12);
      }, 
      error: (err) => {
        this.error = err;
      }
    });
  }

  onHandleError() {
    this.error = null;
  }

  onPageChange(pageNum: number) {
    this.rentalFilteredSet = this.rentals.slice(12*(pageNum-1),12*pageNum);
  }
  
  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}
