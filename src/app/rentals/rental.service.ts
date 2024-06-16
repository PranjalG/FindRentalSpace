import { EventEmitter, Injectable } from "@angular/core";
import { throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Subject } from "rxjs/Subject";

import { WebService } from "app/shared/web.service";

import Rental from "app/models/rental";

@Injectable()
export class RentalService {

    rentals: Rental[] = [];
    newRental: {};
    obj: {};
    page = 1;

    rentalsChangedNew = new Subject<Rental[]>();
    rentalSelectedNew = new EventEmitter<Rental>();

    pageChanged = new Subject<number>();

    constructor(private webService: WebService) {
        this.rentalsChangedNew.subscribe((value) => {
            this.rentals = value;
        });
        this.pageChanged.subscribe((value) => {
            this.page = value;
        });
    }

    private handleError(error) {
        console.log(error);
        return throwError(error.statusText);
      }

    //Create

    addNewRental(obj: JSON) {
        return this.webService.post('rentals', obj ).pipe(
            catchError(this.handleError)
        );
    }

    //Read

    getAll() {
        return this.webService.get('rentals').pipe(
            catchError(this.handleError)
        );
    }

    getList(id: string) {
        return this.webService.get('rentals/'+id).pipe(
            catchError(this.handleError)
        );
    }

    getListAddressFilter(address: string) {
        this.obj = {"address": address}
        return this.webService.post('rentals/address', this.obj).pipe(
            catchError(this.handleError)
        );
    }

    getListFiltered(obj: JSON) {
        return this.webService.post('rentals/filtered', obj ).pipe(
            catchError(this.handleError)
        );
    }

    //Update

    updateList(id: string, receivedRental: JSON) {
        return this.webService.put('rentals/'+id, receivedRental).pipe(
            catchError(this.handleError)
        );
    }

    // Delete

    deleteRental(id: string) {
        return this.webService.delete('rentals/'+id).pipe(
            catchError(this.handleError)
        );
    }
 
}