import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RentalsComponent } from './rentals/rentals.component';
import { CompareComponent } from './compare/compare.component';
import { RentalDetailComponent } from './rentals/rental-detail/rental-detail.component';
import { RentalStartComponent } from './rentals/rental-start/rental-start.component';
import { RentalEditComponent } from './rentals/rental-edit/rental-edit.component';
// import { RecipesResolverService } from './recipes/recipes-resolver.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { RentalNewComponent } from './rentals/rental-new/rental-new.component';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  { path: 'rental-spaces', 
    component: RentalsComponent, 
    canActivate: [AuthGuard],
    children: [
    { path: '' , component: RentalStartComponent},
    { path: 'filter' , component: RentalStartComponent},
    { path: 'new' , component: RentalNewComponent},
    { path: 'search' , component: RentalStartComponent},
    { path: 'page' , 
      component: RentalStartComponent,
      children: [
        { path: ':pageNum', component: RentalStartComponent }
      ]
    },
    { path: ':rentalId' , component: RentalDetailComponent},
    { path: ':rentalId/edit' , component: RentalEditComponent}
  ] 
  },
  { path: 'compare', component: CompareComponent,
    canActivate: [AuthGuard],
  },
  { path: 'auth', component: AuthComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }