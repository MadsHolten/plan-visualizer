import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// Angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule,
         MatInputModule } from '@angular/material';


import { AppComponent } from './app.component';
import { PlanComponent } from './plan/plan.component';


@NgModule({
  declarations: [
    AppComponent,
    PlanComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSelectModule,
    MatInputModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
