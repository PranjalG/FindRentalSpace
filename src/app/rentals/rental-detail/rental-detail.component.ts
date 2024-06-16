import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { RentalService } from '../rental.service';
import Rental from 'app/models/rental';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-rental-detail',
  templateUrl: './rental-detail.component.html'
})
export class RentalDetailComponent implements OnInit{
  rental: Rental = new Rental;

  rentalId: string;
  error: string = null;

  currentUser = false;

  // plusEmoji = '\u{1F3AF}';
  pencilEmoji = '\u{1F4DD}';

  constructor(private rentalService: RentalService,
              private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrService) {}
  
  ngOnInit(): void {
    const userData = JSON.parse(localStorage.getItem('userData')); 

    this.route.params.subscribe(
      (params: Params) => {
        this.rentalId = params['rentalId'];
        this.rentalService.getList(this.rentalId).subscribe( {
          next: (rentalData: Rental[]) => {
            this.rental = rentalData[0];
            this.currentUser = (this.rental.created_by.toLowerCase() == userData.email);
          }, 
          error: (err) => {
            this.error = err;
          } 
      });
      }
    );

  }

  onHandleError() {
    this.error = null;
  }

  onEditRental() {
    console.log(this.route);
    this.router.navigate(['../', this.rentalId, 'edit'], {relativeTo: this.route});
  }

  onDeleteRental() {
    const userData = JSON.parse(localStorage.getItem('userData')); 

    if(this.rental.created_by.toLowerCase() == userData.email) {
    this.rentalService.deleteRental(this.rentalId).subscribe({
      next: (rentalData: Rental) => {
        this.rental = rentalData;
      }, 
      error: (err) => {
        this.error = err;
      }
    });
    this.router.navigate(['../'], {relativeTo: this.route});
    this.toastr.error("Entry deleted");
   } else {
    this.error = "You are not authorized to delete!";
   }
  }

}