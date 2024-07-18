import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './components/user/sign-up/sign-up.component';
import { LoginComponent } from './components/user/login/login.component';
import { ProfileComponent } from './components/user/profile/profile.component';
import { ForgotPasswordComponent } from './components/user/forgot-password/forgot-password.component';
import { BasicSearchComponent } from './components/match/basic-search/basic-search.component';
import { AdvancedSearchComponent } from './components/match/advanced-search/advanced-search.component';
import { MatchRecommendationsComponent } from './components/match/match-recommendations/match-recommendations.component';
import { InterestsComponent } from './components/communication/interests/interests.component';
import { ChatComponent } from './components/communication/chat/chat.component';
import { BlockReportComponent } from './components/communication/block-report/block-report.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'basic-search', component: BasicSearchComponent, canActivate: [AuthGuard] },
  { path: 'advanced-search', component: AdvancedSearchComponent, canActivate: [AuthGuard] },
  { path: 'match-recommendations', component: MatchRecommendationsComponent, canActivate: [AuthGuard] },
  { path: 'interests', component: InterestsComponent, canActivate: [AuthGuard] },
  { path: 'chat', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'block-report', component: BlockReportComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
