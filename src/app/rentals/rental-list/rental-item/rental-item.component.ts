import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { CompareService } from 'app/compare/compare.service';
import Rental from 'app/models/rental';
import UsersF from 'app/models/usersf';
import { RentalService } from 'app/rentals/rental.service';

@Component({
  selector: 'app-rental-item',
  templateUrl: './rental-item.component.html',
  styleUrls: ['./rental-item.component.css']
})

export class RentalItemComponent implements OnInit{
  @Input() index: number;
  @Input() newElement = new Rental;
  @Input() pagenum: number;

  userDBId : string;
  usersf;
  userData;

  subscription : Subscription;
  error: String = null;

  constructor(private compareService: CompareService,
              private rentalService: RentalService) {}

  userFavs : UsersF;
  
  unlikeEmoji = '\u{1F90D}';
  likeEmoji = '\u{1F9E1}';

  emoji = this.unlikeEmoji;

  cardSelected = false;

  currentPage: number;

  ngOnInit(): void {

    this.subscription = this.compareService.userFavouritesChanged.subscribe({
      next: (value) => {
        this.userFavs = value[0];
      }, 
      error: (err) => {
        this.error = err;
      }
    });

    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.compareService.getUserF(this.userData.email).subscribe(
      (userfData) => {
        this.userFavs = userfData[0];
        for (let index = 0; index < this.userFavs.favourite_rentals.length; index++) {
          if (this.newElement._id.toString() == this.userFavs.favourite_rentals[index]) {
            this.cardSelected = true;
          }
        }
      }
    );

    if(this.rentalService.page == 0){
      this.currentPage = 1;
    } else {
      this.currentPage = this.rentalService.page;
    }
  }

  onClickHeart(){
    this.cardSelected = !this.cardSelected;
    
    if(this.cardSelected) {
      this.compareService.getUserF(this.userData.email).subscribe(
        (userfData) => {
          this.userFavs = userfData[0];
          this.userFavs.favourite_rentals.push(this.newElement._id.toString());
          this.usersf = {
            "user_email" : this.userData.email,
            "favourite_rentals" : this.userFavs.favourite_rentals
          }
          this.compareService.addUserF(this.userFavs._id.toString(), this.usersf)
            .subscribe(
              (userfavRental: UsersF)=>{
                // console.log(userfavRental);
              }
            );
        }
      );      
    }
    else {
      this.compareService.getUserF(this.userData.email).subscribe(
        (userfData) => {
          this.userFavs = userfData[0];
          var h = this.userFavs.favourite_rentals.indexOf(this.newElement._id.toString());
          this.userFavs.favourite_rentals.splice(h ,1);
          this.usersf = {
            "user_email" : this.userData.email,
            "favourite_rentals" : this.userFavs.favourite_rentals
          }
          this.compareService.removeUserF(this.userFavs._id.toString(), this.usersf)
            .subscribe((userfavRental)=>{
              this.userFavs = userfavRental[0];
              // console.log(userfavRental);
          });
        }
      );
    }
  }

}
