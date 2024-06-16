import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';

import { AuthResponseData, AuthService } from './auth.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import { WebService } from 'app/shared/web.service';

@Component({
    selector : 'app-auth',
    templateUrl : './auth.component.html'
})
export class AuthComponent implements OnDestroy {
    isLoading = false;
    error: string = null;

    authFormGroup: FormGroup = new FormGroup({
        username : new FormControl(''),
        password : new FormControl(''),
        domain : new FormControl('SML')
    });

    @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

    private closeSub: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {}

    onSubmit() {
        if(this.authFormGroup.value.domain == "choose"){
            this.error = "Select a domain first.";
            return;
        }
        if(!this.authFormGroup.valid) {
            this.error = "This form contains invalid input.";
            return;
        }

        let authObs: Observable<{}>;

        this.isLoading = true;
        this.authFormGroup.value.username = this.authFormGroup.value.username.toLowerCase();
        authObs = this.authService.login(this.authFormGroup.value);

        authObs.subscribe(
            (resData: {"Authenticated": boolean}) => {
                // console.log(resData.Authenticated);
                this.isLoading = false;
                if(resData.Authenticated) {
                    this.router.navigate(['/rental-spaces']);
                } else {
                    this.showErrorAlert("Invalid Credentials");
                }
            }, 
            errorMessage => {
                this.error = errorMessage;
                this.showErrorAlert(errorMessage);
                this.isLoading = false;
            }
        );
        this.authFormGroup.reset();
    }

    onHandleError() {
        this.error = null;
    }

    private showErrorAlert(message: string) {
        //  const alertCmp = new AlertComponent();
        const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
            AlertComponent
        );
        const hostViewContainerRef = this.alertHost.viewContainerRef;
        hostViewContainerRef.clear();

        const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
        componentRef.instance.message = message;
        this.closeSub = componentRef.instance.close.subscribe(() => {
            this.closeSub.unsubscribe();
            hostViewContainerRef.clear();
        });
    }

    ngOnDestroy() {
        if (this.closeSub){
            this.closeSub.unsubscribe();
        }
    }
}