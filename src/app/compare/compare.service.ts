import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import UsersF from 'app/models/usersf';
import { WebService } from 'app/shared/web.service';

@Injectable()
export class CompareService {

    userFavourites: UsersF[];

    userFavouritesChanged = new Subject<UsersF[]>();

    constructor(private webService: WebService) {
      this.userFavouritesChanged.subscribe((value) => {
        this.userFavourites = value;
        console.log(this.userFavourites);
      });
    }

    //READ

    getUserF(emailId: string) {
      return this.webService.get('userfavs/'+emailId);
    }

    // CREATE

    addUserF(userEmail: string, obj: JSON) {
      return this.webService.put('userfavs/' + userEmail, obj);
    }

    // Delete

    removeUserF(userEmail: string, obj: JSON) {
      return this.webService.put('userfavs/' + userEmail, obj);
    }

    // UPDATE

    setParameters(userEmail: string, userParamters: {}){
      return this.webService.put('users/' + userEmail, userParamters);
    }

}