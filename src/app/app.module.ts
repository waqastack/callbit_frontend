import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { PostCompaignComponent } from './components/post-compaign/post-compaign.component';
import { HeaderComponent } from './components/layout/header/header.component';
import { MainComponent } from './components/main/main.component';
import { MyCompaignComponent } from './components/my-compaign/my-compaign.component';
import { FindCompaignComponent } from './components/find-compaign/find-compaign.component';
import { DetailCompaignComponent } from './components/detail-compaign/detail-compaign.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ManageAccountComponent } from './components/manage-account/manage-account.component';
import { AccountComponent } from './components/manage-account/account/account.component';
import { SecurityComponent } from './components/manage-account/security/security.component';
import { FormWComponent } from './components/manage-account/form-w/form-w.component';
import { SelectCompaignComponent } from './components/select-compaign/select-compaign.component';
import { UserCompaignComponent } from './components/user-compaign/user-compaign.component';
import { SubmitProposalComponent } from './components/submit-proposal/submit-proposal.component';
import { ReferralComponent } from './components/referral/referral.component';
import { MessageComponent } from './components/message/message.component';
import * as $ from 'jquery';
import { BillingAndPaymentsComponent } from './components/billing-and-payments/billing-and-payments.component';
import { BudgetPayFixesAmountComponent } from './components/budget-pay-fixes-amount/budget-pay-fixes-amount.component';
import { BudgetPayPerPerformanceComponent } from './components/budget-pay-per-performance/budget-pay-per-performance.component';
import { InviteComponent } from './components/invite/invite.component';
import { InviteOffersComponent } from './components/invite-offers/invite-offers.component';
import { FindCallCenterComponent } from './components/find-call-center/find-call-center.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { InvitationsComponent } from './components/invitations/invitations.component';
import { HiredRequestComponent } from './components/hired-request/hired-request.component';
import { TrackLeadsComponent } from './components/track-leads/track-leads.component';
import { PaymentComponent } from './components/manage-account/payment/payment.component';
import { CommonModule } from '@angular/common';
import { ContractSignComponent } from './components/contract-sign/contract-sign.component';
import { TimeZoneService } from 'src/app/services/time-zone.service';
import { ClientContractSignComponent } from './components/client-contract-sign/client-contract-sign.component';
import { MemberShipProposalComponent } from './components/member-ship-proposal/member-ship-proposal.component';
import { ResetPasswordComponent } from './components/manage-account/reset-password/reset-password.component';
import { ForgotPasswordComponent } from './components/manage-account/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { JwPaginationModule } from 'jw-angular-pagination';
import { ProfilePopupComponent } from './components/common/profile-popup/profile-popup.component';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { HowItsWorkComponent } from './how-its-work/how-its-work.component';
import { AboutComponent } from './about/about.component';
import { HelpAndSupportComponent } from './help-and-support/help-and-support.component';
import { RatingModule } from 'ngx-bootstrap/rating';
import { FindCallCenterNoAuthComponent } from './components/find-call-center-no-auth/find-call-center-no-auth.component';
import { SubmitProposalNoAuthComponent } from './components/submit-proposal-no-auth/submit-proposal-no-auth.component';
/*import { AnimateOnScrollModule } from 'ng2-animate-on-scroll';*/
import { NotificationDetailComponent } from './components/notification-detail/notification-detail.component';
import { EditCompaignComponent } from './components/common/edit-compaign/edit-compaign.component';
import { ConfirmWindowComponent } from './components/common/confirm-window/confirm-window.component';
import { ProposalDetailComponent } from './components/proposal-detail/proposal-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ReadMoreComponent } from './components/read-more/read-more.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SignupComponent,
    PostCompaignComponent,
    HeaderComponent,
    MainComponent,
    MyCompaignComponent,
    FindCompaignComponent,
    DetailCompaignComponent,
    ProfileComponent,
    ManageAccountComponent,
    AccountComponent,
    SecurityComponent,
    FormWComponent,
    SelectCompaignComponent,
    UserCompaignComponent,
    SubmitProposalComponent,
    ReferralComponent,
    MessageComponent,
    BillingAndPaymentsComponent,
    BudgetPayFixesAmountComponent,
    BudgetPayPerPerformanceComponent,
    InviteComponent,
    InviteOffersComponent,
    FindCallCenterComponent,
    InvitationsComponent,
    HiredRequestComponent,
    TrackLeadsComponent,
    PaymentComponent,
    ContractSignComponent,
    ClientContractSignComponent,
    MemberShipProposalComponent,
    ResetPasswordComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProfilePopupComponent,
    HowItsWorkComponent,
    AboutComponent,
    HelpAndSupportComponent,
    FindCallCenterNoAuthComponent,
    SubmitProposalNoAuthComponent,
    NotificationDetailComponent,
    EditCompaignComponent,
    ConfirmWindowComponent,
    ProposalDetailComponent,
    ReadMoreComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
/*    AnimateOnScrollModule.forRoot(),*/
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    Ng2SearchPipeModule,
    CarouselModule,
    JwPaginationModule,
    ModalModule,
    CKEditorModule,
    NgxPaginationModule,
    RatingModule.forRoot(),
    TypeaheadModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      easing: 'ease-in',
      easeTime: 100,
    }),
  ],
  exports:[NgxPaginationModule],
  providers: [BsModalService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: 'TimeZoneService', useClass: TimeZoneService },
    // provider used to create fake backend
    // fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
