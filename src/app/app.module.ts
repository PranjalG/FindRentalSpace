import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RentalsComponent } from './rentals/rentals.component';
import { RentalDetailComponent } from './rentals/rental-detail/rental-detail.component';
import { RentalListComponent } from './rentals/rental-list/rental-list.component';
import { RentalItemComponent } from './rentals/rental-list/rental-item/rental-item.component';
import { CompareComponent } from './compare/compare.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { CompareService } from './compare/compare.service';
import { RentalStartComponent } from './rentals/rental-start/rental-start.component';
import { RentalEditComponent } from './rentals/rental-edit/rental-edit.component';
import { RentalService } from './rentals/rental.service';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AlertComponent } from './shared/alert/alert.component';
import { PlaceholderDirective } from './shared/placeholder/placeholder.directive';
import { CompareItemComponent } from './compare/compare-item/compare-item.component';
import { RentalNewComponent } from './rentals/rental-new/rental-new.component';
import { AuthComponent } from './auth/auth.component';
import { RentalFilterComponent } from './rentals/rental-list/rental-filter/rental-filter.component';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RentalsComponent,
    RentalDetailComponent,
    RentalListComponent,
    RentalItemComponent,
    CompareComponent,
    DropdownDirective,
    RentalStartComponent,
    RentalEditComponent,
    LoadingSpinnerComponent,
    AlertComponent,
    PlaceholderDirective,
    CompareItemComponent,
    RentalNewComponent,
    AuthComponent,
    RentalFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot()
  ],
  providers: [
    CompareService,
    RentalService,
    HttpClient
    // {
    //   provide: HTTP_INTERCEPTORS, 
    //   useClass: AuthInterceptorService,
    //   multi: true
    // }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
