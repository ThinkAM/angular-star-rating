import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { FormControlStarRatingComponent } from './components/form-control-star-rating/form-control-star-rating.component';
import { StaticModuleModule } from './static-module/static-module.module';
import { HttpClientModule } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { StarRatingModule } from 'angular-star-rating';

const DECLARATIONS = [
  AppComponent,
  FormControlStarRatingComponent
];
@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    StarRatingModule.forRoot(),
    StaticModuleModule,
    FontAwesomeModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          redirectTo: 'form',
          pathMatch: 'full',
        },
        {
          path: 'form-control',
          component: FormControlStarRatingComponent,
        },
        // static-config-override routes in its module
        {
          path: 'lazy-config-override',
          loadChildren: () =>
            import(
              'apps/embedded/src/app/lazy-module/lazy-module.module'
            ).then((m) => m.LazyModuleModule),
        },
        {
          path: '**',
          redirectTo: 'form-control',
        },
      ],
      {
        useHash: true,
      }
    ),
  ],
  declarations: [DECLARATIONS],
  bootstrap: [AppComponent],
})
export class AppModule {}
