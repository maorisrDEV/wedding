import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {HttpClientModule} from '@angular/common/http';
import {AgmCoreModule} from '@agm/core';
import {FormsModule} from '@angular/forms';
import {LoadingComponent} from './loading/loading.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {MatDialogModule} from '@angular/material/dialog';
import { DialogMessageComponent } from './dialog-message/dialog-message.component';



@NgModule({
  declarations: [
    AppComponent,
    LoadingComponent,
    PageNotFoundComponent,
    HomeComponent,
    DialogMessageComponent
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: process.env.GOOGLE_MAPS_API_KEY,
      libraries: ['places']
    }),
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
