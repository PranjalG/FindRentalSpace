import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

import { catchError, tap } from "rxjs/operators";
import { throwError, BehaviorSubject } from "rxjs";

import { User } from "./user.model";
import { WebService } from "app/shared/web.service";
import * as activeDirectory from 'activedirectory';

export interface AuthResponseData {
    email: string;
    message: string;
}

@Injectable({ providedIn: 'root'})

export class AuthService {
    
    user = new BehaviorSubject<User>(null);
    userInDB: {};

    private tokenExpirationTimer: any;

    userData: {};

    constructor(private router: Router,
                private webService: WebService) {}

    login(userCredentials: {"username": string, "password": string, "domain": string}) {
        // console.log(process.env);
        
        return this.webService.post("userauth", userCredentials)
            .pipe(catchError(this.handleError),
                tap((data: {"Authenticated": boolean}) => {
                    if(data.Authenticated) {
                        this.onFindUserInDatabase(userCredentials.username);
                        this.handleAuthentication(
                            userCredentials.username
                        );
                    }
                })
            );
    }

    autoLogin() {
        const userData: {
            email: string;
            // id: string;
            // _token: string;
            // _tokenExpirationDate: string
        } = JSON.parse(localStorage.getItem('userData'));
        if( !userData ) {
            return;
        }
        const loadedUser = new User(
            userData.email, 
            // userData.id, 
            // userData._token, 
            // new Date(userData._tokenExpirationDate)
        );
        if (loadedUser) {
           this.user.next(loadedUser); 
        //    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        //    this.autoLogout(expirationDuration);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        // if (this.tokenExpirationTimer)  {
        //     clearTimeout(this.tokenExpirationTimer);
        // }
        this.tokenExpirationTimer = null;
    }

    // autoLogout(expirationDuration: number) {
    //     this.tokenExpirationTimer = setTimeout(() => {
    //         this.logout();
    //     }, expirationDuration);
    // }

    onFindUserInDatabase(email: string){
        return this.webService.get('users/'+email).subscribe(
            (userData) => {
                if(!Boolean(userData)){
                    this.onCreateUserInDatabase(email);
                }
            }
        );
    }

    onCreateUserInDatabase(userEmail: string) {
        this.userInDB = {
            "user_email" : userEmail,
            "favourite_rentals" : [],
            "parameters": {
                "rent": true,
                "distance": true,
                "expected_availability": false,
                "family_preference": false,
                "food_preference": false,
                "owner_contact": true
            }
        }
        return this.webService.post('users', this.userInDB).subscribe(
            (userData) => {
                console.log("user created in Db:"+userData);
            }
        );
    }

    private handleAuthentication(
        email: string, 
        // userId: string,
        // token: string,
        // expiresIn: number
    ) {
        // const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
        const user = new User(
            email 
            // userId,
            // token, 
            // expirationDate
        );
        this.user.next(user);
        // this.autoLogout(expiresIn * 1000);
        localStorage.setItem('userData', JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage);
        }
        return throwError(errorMessage);
    }
}