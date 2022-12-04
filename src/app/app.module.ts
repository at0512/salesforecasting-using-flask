import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadComponent } from './upload/upload.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginpagecompComponent } from './loginpagecomp/loginpagecomp.component';  
import { RouterModule } from '@angular/router';
import { NgModel } from '@angular/forms'; 
import { Router } from '@angular/router'; 
@NgModule({
  declarations: [
    AppComponent,
    UploadComponent,
    DashboardComponent,
    LoginpagecompComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    FormsModule, 
    HttpClientModule, 
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
