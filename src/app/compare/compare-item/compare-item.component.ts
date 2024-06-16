import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';

import RentalG from 'app/models/rental';
import UsersF from 'app/models/usersf';

import { CompareService } from '../compare.service';

@Component({
  selector: 'app-compare-item',
  templateUrl: './compare-item.component.html'
})
export class CompareItemComponent implements OnInit{

  @Input() compareElement: RentalG;
  userFavs : UsersF;
  userfavlist;
  userData;
  index: number;

  constructor(private compareService: CompareService,
              private router: Router,
              private route: ActivatedRoute) {}

  parameterForm = new FormGroup({
    rentChecked : new FormControl(null),
    distChecked : new FormControl(null),
    famPrefChecked : new FormControl(null),
    foodPrefChecked : new FormControl(null),
    expAvChecked : new FormControl(null),
    ownerChecked : new FormControl(null)
  });

  onRemove(id) {
    this.compareService.getUserF(this.userData.email).subscribe(
      (userfData) => {
        this.userFavs = userfData[0];
        this.index = this.userFavs.favourite_rentals.indexOf(id.toString());
        this.userFavs.favourite_rentals.splice(this.index , 1);
        this.userfavlist = {
          "user_email" : this.userData.email,
          "favourite_rentals" : this.userFavs.favourite_rentals
        }
        this.compareService.removeUserF(this.userFavs._id.toString(), this.userfavlist)
        .subscribe(
          (userfavRental)=>{
            console.log(userfavRental);
          }
        );
      }
    ); 
    // this.router.navigate(['../'], {relativeTo: this.route});
    window.location.reload();
  }

  ngOnInit() {
    this.userData = JSON.parse(localStorage.getItem('userData'));
    this.compareService.getUserF(this.userData.email).subscribe(
      (userfData) => {
        this.userFavs = userfData[0];
        this.parameterForm = new FormGroup({
          rentChecked : new FormControl(this.userFavs.parameters["rent"]),
          distChecked : new FormControl(this.userFavs.parameters["distance"]),
          famPrefChecked : new FormControl(this.userFavs.parameters["family_preference"]),
          foodPrefChecked : new FormControl(this.userFavs.parameters["food_preference"]),
          expAvChecked : new FormControl(this.userFavs.parameters["expected_availability"]),
          ownerChecked : new FormControl(this.userFavs.parameters["owner_contact"])
        })
      }
    );
  }
}