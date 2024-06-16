import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { RentalService } from '../rental.service';
import Rental from 'app/models/rental';

@Component({
  selector: 'app-rental-edit',
  templateUrl: './rental-edit.component.html',
  styleUrls: ['./rental-edit.component.css']
})
export class RentalEditComponent implements OnInit{
  
  rentalId: string;
  rental: Rental = new Rental;
  error: string = null;

  rentalFormGroup: FormGroup = new FormGroup({
    owner : new FormControl('', Validators.required),
    owner_contact : new FormControl(null, Validators.required),
    distance : new FormControl(null, Validators.required),
    city : new FormControl('', Validators.required),
    type : new FormControl('', Validators.required),
    address : new FormControl('', Validators.required),
    landmark : new FormControl('', Validators.required),
    family_preference : new FormControl('', Validators.required),
    food_preference : new FormControl('', Validators.required),
    expected_availability : new FormControl('', Validators.required),
    refree : new FormControl('', Validators.required),
    refree_contact : new FormControl(null, [Validators.maxLength(10), Validators.minLength(10), Validators.required]),
    comments : new FormControl('', Validators.required),
    rent : new FormControl('', Validators.required),
    last_update : new FormControl('', Validators.required),
    bedroom_type : new FormControl('', Validators.required),
    image_path : new FormControl('')});

  constructor(private route: ActivatedRoute, 
              private router: Router,
              private rentalService: RentalService,
              private toastr: ToastrService) {}

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.rentalId = params['rentalId'];
        this.rentalService.getList(this.rentalId).subscribe(
          (rentalData) => {
            this.rental = rentalData[0];
            this.initForm();
          }
        );
      });
  }

  onHandleError() {
    this.error = null;
  }

  onSubmit(){
      const userData = JSON.parse(localStorage.getItem('userData')); 
      if (this.rental.created_by == userData.email){
        this.rentalService.updateList(this.rentalId, this.rentalFormGroup.value).subscribe(
          (rental: Rental) => {
            this.rental = rental;
          } 
        );
        this.router.navigate(['../'], {relativeTo: this.route});
        this.toastr.success("Saved successfully!");
      }      
      else {
        this.error = "You are not authorized to edit!";
      }
  }

  onCancel() {
    this.router.navigate(['../'], {relativeTo: this.route});
    this.toastr.warning("Changes not saved!");
  }

  get controls() {                                                     // a getter method
    return (<FormArray>this.rentalFormGroup.get('rental')).controls;
  }

  private initForm() {
    let rentalOwner = '';
    let rentalOwnerContact : number;
    let rentalType = '';
    let rentalBedroomType = '';
    let rentalAddress = '';
    let rentalLandmark = '';
    let rentalDistance : number;
    let rentalFamilyPref = '';
    let rentalFoodPref = '';
    let rentalRefreeName = '';
    let rentalRefreeContact : number;
    let rentalExpectedAvailability = '';
    let rentalComments = '';
    let rentalLastUpdate = '';
    let rentalRent : number;
    let rentalCity = '';
    let rentalImagePath = '';

      const rental = this.rental;
      rentalOwner = rental.owner;
      rentalOwnerContact = rental.owner_contact;
      rentalType = rental.type;
      rentalBedroomType = rental.bedroom_type;
      rentalAddress = rental.address;
      rentalLandmark = rental.landmark;
      rentalDistance = rental.distance;
      rentalCity = rental.city;
      rentalFamilyPref = rental.family_preference;
      rentalFoodPref = rental.food_preference;
      rentalRefreeName = rental.refree;
      rentalRefreeContact = rental.refree_contact;
      rentalExpectedAvailability = rental.expected_availability;
      rentalComments = rental.comments;
      rentalLastUpdate = rental.last_update;
      rentalRent = rental.rent;
      rentalImagePath = rental.image_path;

    this.rentalFormGroup = new FormGroup({
      owner : new FormControl(rentalOwner, Validators.required),
      owner_contact : new FormControl(rentalOwnerContact, [Validators.maxLength(10), Validators.minLength(10), Validators.required]),
      distance : new FormControl(rentalDistance, Validators.required),
      city : new FormControl(rentalCity, Validators.required),
      type : new FormControl(rentalType, Validators.required),
      address : new FormControl(rentalAddress, Validators.required),
      landmark : new FormControl(rentalLandmark, Validators.required),
      family_preference : new FormControl(rentalFamilyPref, Validators.required),
      food_preference : new FormControl(rentalFoodPref, Validators.required),
      expected_availability : new FormControl(rentalExpectedAvailability, Validators.required),
      refree : new FormControl(rentalRefreeName, Validators.required),
      refree_contact : new FormControl(rentalRefreeContact, [Validators.maxLength(10), Validators.minLength(10), Validators.required]),
      comments : new FormControl(rentalComments, Validators.required),
      rent : new FormControl(rentalRent, Validators.required),
      last_update : new FormControl(rentalLastUpdate, Validators.required),
      bedroom_type : new FormControl(rentalBedroomType, Validators.required),
      image_path : new FormControl(rentalImagePath, Validators.required)
    });
  }
}