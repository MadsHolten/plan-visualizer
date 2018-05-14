import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

// Interceptor
import { AuthInterceptor } from './services/auth.interceptor';

// Local storage
import { WebStorageModule } from 'ngx-store';

// ION range slider
import { IonRangeSliderModule } from "ng2-ion-range-slider";

// FxFlex
import { FlexLayoutModule } from '@angular/flex-layout';

// Angular material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule,
         MatButtonModule,
         MatMenuModule,
         MatDialogModule,
         MatInputModule,
         MatTooltipModule,
         MatSnackBarModule,
         MatCardModule,
         MatIconModule,
         MatExpansionModule } from '@angular/material';

// Chart.js angular implementation
import { ChartsModule } from 'ng2-charts/ng2-charts';

// Pipes
import { MarkdownToHtmlModule } from 'markdown-to-html-pipe';

// Directives
import { CanvasEventsDirective } from './directives/canvas-events.directive';

// Components
import { AppComponent } from './app.component';
import { PlanComponent } from './plan/plan.component';
import { SettingsComponent } from './settings/settings.component';
import { ChartDialogComponent } from './dialogs/chart-dialog.component';
import { LineChartDemoComponent } from './dialogs/charts/chart-x.component';


@NgModule({
  declarations: [
    AppComponent,
    PlanComponent,
    SettingsComponent,
    CanvasEventsDirective,
    ChartDialogComponent,
    LineChartDemoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    WebStorageModule,
    HttpClientModule,
    FlexLayoutModule,
    ChartsModule,
    IonRangeSliderModule,
    MatSelectModule,
    MatDialogModule,
    MatSnackBarModule,
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
  entryComponents: [ChartDialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
