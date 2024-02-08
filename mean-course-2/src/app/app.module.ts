import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule} from "@angular/forms";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatCard, MatCardContent, MatCardTitle} from "@angular/material/card";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatAnchor, MatButton, MatFabButton, MatIconButton} from "@angular/material/button";
import { HeaderComponent } from './header/header.component';
import {MatToolbar} from "@angular/material/toolbar";
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelActionRow,
  MatExpansionPanelHeader
} from "@angular/material/expansion";
import {MatDivider} from "@angular/material/divider";
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {PostListComponent} from "./posts/post-list/post-list.component";
import {MatIcon} from "@angular/material/icon";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

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
    ReactiveFormsModule,
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
    MatCardContent,
    MatError,
    MatExpansionPanelActionRow,
    MatIconButton,
    MatIcon,
    MatCardTitle,
    HttpClientModule,
    MatAnchor,
    MatProgressSpinner,
    MatFabButton
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
