import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PostCreateComponent } from './post-create/post-create.component';
import {FormsModule} from "@angular/forms";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import {MatToolbar} from "@angular/material/toolbar";
import { PostListComponent } from './post-list/post-list.component';
import {MatAccordion, MatExpansionPanel, MatExpansionPanelHeader} from "@angular/material/expansion";
import {MatDivider} from "@angular/material/divider";

@NgModule({
  declarations: [
    AppComponent,
    PostCreateComponent,
    HeaderComponent,
    PostListComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        MatCard,
        MatFormField,
        MatLabel,
        MatInput,
        MatButton,
        MatToolbar,
        MatAccordion,
        MatExpansionPanel,
        MatExpansionPanelHeader,
        MatDivider,
        MatCardContent
    ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
