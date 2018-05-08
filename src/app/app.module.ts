import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Interceptor
import { AuthInterceptor } from './services/auth.interceptor';

// Local storage
import { WebStorageModule } from 'ngx-store';

// Angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule,
         MatButtonModule,
         MatMenuModule,
         MatInputModule,
         MatTooltipModule,
         MatCardModule,
         MatIconModule,
         MatExpansionModule } from '@angular/material';

// Pipes
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';


import { AppComponent } from './app.component';
import { PlanComponent } from './plan/plan.component';
import { NgPlanComponent } from './ng-plan/ng-plan.component';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [
    AppComponent,
    PlanComponent,
    NgPlanComponent,
    SettingsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    WebStorageModule,
    HttpClientModule,
    MatSelectModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatTooltipModule,
    MatCardModule,
    MatIconModule,
    MatExpansionModule,
    MarkdownToHtmlModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi   : true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
