import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { BasicSearchComponent } from './components/match/basic-search/basic-search.component';
import { AdvancedSearchComponent } from './components/match/advanced-search/advanced-search.component';
import { MatchRecommendationsComponent } from './components/match/match-recommendations/match-recommendations.component';
import { InterestsComponent } from './components/communication/interests/interests.component';
import { ChatComponent } from './components/communication/chat/chat.component';
import { BlockReportComponent } from './components/communication/block-report/block-report.component';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './components/user/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    SignUpComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ProfileComponent,
    BasicSearchComponent,
    AdvancedSearchComponent,
    MatchRecommendationsComponent,
    InterestsComponent,
    ChatComponent,
    BlockReportComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
