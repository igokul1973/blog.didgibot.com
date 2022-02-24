import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HeaderHomeComponent } from './header-home/header-home.component';
import { HeaderOtherComponent } from './header-other/header-other.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        FooterComponent,
        PageNotFoundComponent,
        HeaderHomeComponent,
        HeaderOtherComponent
    ],
    imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
