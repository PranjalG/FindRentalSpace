import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import { Subscription } from 'rxjs/Subscription';

import Rental from 'app/models/rental';
import { RentalService } from '../rental.service';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css']
})

export class RentalListComponent implements OnInit, OnDestroy {
  rentals : Rental[] = [];
  subscription : Subscription;
  id: string;
  filterOptionsVisible = false;
  error: String = null;
  pageNumber = 0;
  dataFiltered = false;

  rentalSet;

  magnifyingGlass= '\u{1F50E}';
  plusEmoji = '\u2795';

  upArrow = '\u2191';
  downArrow = '\u2193';

  userInput : string = '';
  distance = 8;
  rent = 15;

  dataLength = 1;
  numberOfPages = 1;

  filterForm: FormGroup = new FormGroup({
    type : new FormControl(''),
    btype : new FormControl(''),
    famPref : new FormControl(''),
    foodPref : new FormControl(''),
    distMark : new FormControl(8),
    rentMark : new FormControl(15000)
  });

  constructor(private rentalService: RentalService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.subscription = this.rentalService.rentalsChangedNew.subscribe({          // Updates the rentals whenever rentalsData changes
      next: (rentalsData: Rental[]) => {
        this.rentals = rentalsData;
      }, 
      error: (err) => {
        this.error = err;
      }
    });
    
    this.rentalService.getAll().subscribe({
      next: (rentalsData: Rental[]) => {
        this.dataLength = rentalsData.length;
        this.numberOfPages = Math.trunc(this.dataLength/12) + 1;
      }, 
      error: (err) => {
        this.error = err;
      }
    });
  
    this.rentalService.getAll().subscribe({
      next: (rentalsData: Rental[]) => {
        this.rentals = rentalsData;
        this.rentalSet = this.rentals.slice(0,12);
      }, 
      error: (err) => {
        this.error = err;
      }
    });

    this.subscription = this.rentalService.pageChanged.subscribe({       // Changes the page number on user click
      next: (number: number) => {
        this.pageNumber = number;
      }, 
      error: (err) => {
        this.error = err;
      }
    });
  }

  onSearchAddress() {
    this.router.navigate(['search'], {relativeTo: this.route});
    this.rentalService.getListAddressFilter(this.userInput).subscribe({
      next: (rentalsData: Rental[]) => {
        this.rentals = rentalsData;
        this.dataLength = rentalsData.length;
        this.numberOfPages = Math.trunc(this.dataLength/12) + 1;
        this.rentalSet = this.rentals.slice(0,12);
      }, 
      error: (err) => {
        this.error = err;
      }
    });
  }

  onAddNewSpace() {
    this.router.navigate(['new'], {relativeTo: this.route});
  }

  onFilters() {        
    this.filterOptionsVisible = !this.filterOptionsVisible;
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

  onHandleError() {
    this.error = null;
  }

  onPageChange(pageNum: number) {
    this.router.navigate(['/rental-spaces'],{relativeTo: this.route});
    this.pageNumber = pageNum;
    this.rentalSet = this.rentals.slice(12*(pageNum-1),12*pageNum);
  }
  
  ngOnDestroy () {
    this.subscription.unsubscribe();
  }
}
