import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './helpers/auth.guard';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { PostCompaignComponent } from './components/post-compaign/post-compaign.component';
import { MainComponent } from './components/main/main.component';
import { MyCompaignComponent } from './components/my-compaign/my-compaign.component';
import { SelectCompaignComponent } from './components/select-compaign/select-compaign.component';
import { UserCompaignComponent } from './components/user-compaign/user-compaign.component';
import { FindCompaignComponent } from './components/find-compaign/find-compaign.component';
import { DetailCompaignComponent } from './components/detail-compaign/detail-compaign.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ReferralComponent } from './components/referral/referral.component';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { MessageComponent } from './components/message/message.component';
import { SubmitProposalComponent } from './components/submit-proposal/submit-proposal.component';
import { FindCallCenterComponent } from './components/find-call-center/find-call-center.component';
import { AccountComponent } from './components/manage-account/account/account.component';
import { InvitationsComponent } from './components/invitations/invitations.component';
import { HiredRequestComponent } from './components/hired-request/hired-request.component';
import { TrackLeadsComponent } from './components/track-leads/track-leads.component';
import { PaymentComponent } from './components/manage-account/payment/payment.component';
import { ContractSignComponent } from './components/contract-sign/contract-sign.component';
import { ClientContractSignComponent } from './components/client-contract-sign/client-contract-sign.component';
import { MemberShipProposalComponent } from './components/member-ship-proposal/member-ship-proposal.component';
import { ResetPasswordComponent } from './components/manage-account/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/manage-account/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import {AboutComponent} from './about/about.component';
import {HowItsWorkComponent} from './how-its-work/how-its-work.component';
import {HelpAndSupportComponent} from './help-and-support/help-and-support.component'
import { FindCallCenterNoAuthComponent } from './components/find-call-center-no-auth/find-call-center-no-auth.component';
import { SubmitProposalNoAuthComponent } from './components/submit-proposal-no-auth/submit-proposal-no-auth.component';
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { ProposalDetailComponent } from './components/proposal-detail/proposal-detail.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'post',
    component: PostCompaignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'select',
    component: SelectCompaignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my',
    component: MyCompaignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'submitproposal/:id',
    component: SubmitProposalComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'user',
    component: UserCompaignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    component: AccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'find',
    component: FindCompaignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'detail/:id',
    component: DetailCompaignComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'referral',
    component: ReferralComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'setting',
    component: ManageAccountComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'message',
    component: MessageComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'FindCallCenter',
    component: FindCallCenterComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'Invitations',
    component: InvitationsComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'HiredRequest',
    component: HiredRequestComponent,
  },
  {
    path: 'TrackLeads',
    component: TrackLeadsComponent,
  },
  {
    path: 'payment',
    component: PaymentComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'Member',
    component: MemberShipProposalComponent,
  },
  {
    path: 'Contracts',
    component: ContractSignComponent,
  },
  {
    path: 'ClientContractSign',
    component: ClientContractSignComponent,
  },
  {
    path:'howItsWork',
    component:HowItsWorkComponent

  },
  {
    path:'about',
    component:AboutComponent
  },
  {
    path:'helpAndSupport',
    component:HelpAndSupportComponent
  },
  {
    path: 'resetPassword',
    component: ResetPasswordComponent,
  },
  {
    path: 'forgotPassword',
    component: ForgotPasswordComponent,
  },
  {
    path: 'verifyEmail',
    component: VerifyEmailComponent,
  },
  {
    path: 'CompiagnsList',
    component: FindCallCenterNoAuthComponent
    // canActivate: [AuthGuard]
  },
  {
    path: 'submitproposals/:id',
    component: SubmitProposalNoAuthComponent
  },
  {
    path: 'Notifications',
    component: NotificationDetailComponent
  },
  {
    path: 'Proposal/:id',
    component: ProposalDetailComponent,
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
