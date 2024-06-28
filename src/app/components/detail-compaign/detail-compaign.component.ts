import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompaignResponse } from 'src/app/models/Compaign';
import { CompaignService } from 'src/app/services/compaign.service';
import {
  InviteResponse,
  InvitationRequest,
  MessageRequest,
  HiredRequest,
  ClientHiredRqst,
  ClientHiredRsp,
  ClientLeadSubRqst,
  QstnsLst,
  LeadSubList,
  LeadSubQstList,
} from 'src/app/models/hiring-user';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { ProfileInfo } from 'src/app/models/profileInfo';
import { ProfileService } from 'src/app/services/ProfileService.service';
import {
  CompaignEditRequest,
  CompaignEditableShow,
} from 'src/app/models/Compaign';
import * as signalR from '@aspnet/signalr';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { GenericService } from '../../services/generic.service';
import { Payment } from 'src/app/models/payment.model';
declare var $;
import * as $ from 'jquery';
import { ProfilePopupComponent } from '../common/profile-popup/profile-popup.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from "@angular/forms"
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'

@Component({
  selector: 'app-detail-compaign',
  templateUrl: './detail-compaign.component.html',
  styleUrls: ['./detail-compaign.component.css'],
})
export class DetailCompaignComponent implements OnInit, AfterViewInit, OnDestroy  {
  private sub: any;
  _compaign: CompaignResponse;
  compaignResponse: CompaignResponse;
  inviteResponse: InviteResponse[] = [];
  proposalResponse: InviteResponse[] = [];
  param: number;
  skillsKeyword: string[];
  navigationValue: string = 'View Posted Campaigns';
  searchTextProposal: any;
  searchTextInvite: any;
  flagInvite: boolean = false;
  flagProposal: boolean = false;
  invitationRqst: InvitationRequest;
  messageRqst: MessageRequest;
  profileViewerResponse: InviteResponse[] = [];
  profileViewerReq: InviteResponse;
  hiredRequest: HiredRequest;
  now: number;
  profilePicture: string = '../../../assets/images/profile-pic.png';
  userID: number;
  clientHiredRsp: ClientHiredRsp[] = [];
  clientHiredRqst: ClientHiredRqst;
  countEarnNoti: number;
  earnNoti: any[];
  _profileInfo: ProfileInfo;
  userIDC: string;
  profilePictureC: string = '../../../assets/images/profile-pic.png';
  _clientLeadSubRqst: ClientLeadSubRqst;
  objQstnsLst: QstnsLst[];
  newAttribute: any = {};

  firstField = true;
  firstFieldName = 'First Item name';
  isEditItems: boolean;
  leadSubList: LeadSubList[];
  leadSubQstList: LeadSubQstList[];
  createForm: boolean;
  rqstrID: number;
  countProposal: number = 0;
  hiredResponse: any[];
  flag: number = 2;
  objHiredCallCenter: InviteResponse;
  compaign: CompaignEditRequest;
  compaignEditable: CompaignEditableShow;
  emailFrom: string = '';
  emailTo: string = '';
  ChatServerUrl = 'http://54.159.110.221:3000';
  roomDetail: RoomDetail = new RoomDetail();
  hubConnection: signalR.HubConnection;
  message: string = '';
  selectedUser: UserDetail;
  userList: UserDetail[] = [];
  questions = [];
  chat: SchedularChat = new SchedularChat();
  payment: Payment;
  visibleProposalReview: boolean = false;
  visibleProposalData: boolean = false;
  bsModalRef: BsModalRef;
  pageOfItems: Array<any>;
  nameCallCenter: string = '';
  title: string = '';
  tag: string = '';
  selectedPageSize: number = 10;
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;
  stripe;
  loading = false;
  confirmation;
  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;
  config_InviteWorkerList = {
    id: "pg_Worker",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  constructor(private service: CompaignService, private spinner: NgxSpinnerService,
    private route: ActivatedRoute, private router: Router,
    private hiringWorkerService: HiringWorkerService, private toastr: ToastrService,
    private _ProfileService: ProfileService, private authenticationService: AuthenticationService,
    private gService: GenericService, private el: ElementRef, private modalService: BsModalService,
    private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService  ) {
    this.compaignResponse = new CompaignResponse;
    this.inviteResponse = [];
    this.proposalResponse = [];
    this.invitationRqst = new InvitationRequest();
    this.messageRqst = new MessageRequest();
    this.profileViewerResponse = [];
    this.profileViewerReq = new InviteResponse();
    this.hiredRequest = new HiredRequest();
    this.userID = Number(localStorage.getItem('currentUserNo'));
    this.clientHiredRsp = [];
    this.clientHiredRqst = new ClientHiredRqst();
    this._profileInfo = new ProfileInfo();
    this._clientLeadSubRqst = new ClientLeadSubRqst();
    this.objQstnsLst = [];
    this.leadSubList = [];
    this.leadSubQstList = [];
    this.objHiredCallCenter = new InviteResponse();
    this.compaign = new CompaignEditRequest();
    this.compaignEditable = new CompaignEditableShow();
    const currentUser = this.authenticationService.currentUserValue;
    this.emailFrom = currentUser.username;
    this.selectedUser = new UserDetail();
    this.payment = new Payment;
    setInterval(() => {
      this.now = Date.now();
    }, 1);
  }
  ngOnInit(): void {
    // Get Query parameter
    this.sub = this.route.params.subscribe((params) => {
      this.param = +params['id'];
      this.GetSingleCompaign(this.param);
    });
    // Initialization
    this.getProposalReviewer();
    this._compaign = new CompaignResponse();
  }
  ngAfterViewInit(): void {
    this.stripeService.setPublishableKey('pk_test_51IzHKXIDrCXc6Uk6VeuYcQpquygN7QaUtavNVK0zBMyKS17DnP5z6PlxGX7ZvrrvPEN3w47hk3D5TE3EUE0fOJVd00tHR6pvkD').then(
      stripe => {
        this.stripe = stripe;
        const elements = stripe.elements();
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      });
    this.spinner.show();
    
  }
  getProposalReviewer() {
    this.spinner.show();
    this.hiringWorkerService.getProposalReviewer(this.param).subscribe(res => {
      this.spinner.hide();
      debugger
      this.hiredResponse = res as [];
      this.countProposal = 0;
      var rst = this.hiredResponse.filter(x => x.hireStatus == 'Hired Proposal Accepted')
      this.countProposal = rst.length;

    }, error => {
      this.spinner.hide();
    });
  }
  GetSingleCompaign(id) {
    this.spinner.show();
    this.service.getSingleCompaign(id).subscribe(
      (res) => {
        this.spinner.hide();
        debugger
        this._compaign = res as CompaignResponse;
        this.compaignResponse = this._compaign[0];
        if (this.compaignResponse.title == null) {
          this.compaignResponse.title = this.compaignResponse.name;
        }
        this.skillsKeyword = this.compaignResponse.type.split(',');
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }

  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }

  async onSubmit(form: NgForm) {
    const { token, error } = await this.stripe.createToken(this.card);

    if (error) {
      console.log('Error:', error);
    } else {
      var cardid = token.card.id;
      var year = token.card.exp_year;
      var month = token.card.exp_month;
      var last4Digit = token.card.last4;
      var addressZip = token.card.address_zip;
      var brand = token.card.brand;
      var tokenID = token.id;
      this.postPayment(cardid, year, month, last4Digit, addressZip, brand, tokenID);
      console.log('Success!', token);
    }
  }
  navigateMainTab(value: number) {
    if (value == 1) {
      this.navigationValue = 'View Posted Campaigns';
    }
    if (value == 2) {
      this.navigationValue = 'Invite';
      this.GetInvitedWorker();
    }
    if (value == 3) {
      this.navigationValue = 'Proposals Review';
      this.GetProposalWorker();
    }
    if (value == 4) {
      this.navigationValue = 'Hire';
      this.GetHiredRequests();
    }
  }
  InviteCoworkers() {
    return alert('Under Construction');
  }
  ProposalOpen(obj: InviteResponse) {
    let newRelativeUrl = this.router.createUrlTree(['/Proposal', obj.proposalID]);
    let baseUrl = window.location.href.replace(this.router.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
  }
  GetInvitedWorker() {
    this.config_InviteWorkerList.itemsPerPage = this.selectedPageSize;
    this.spinner.show();
    this.hiringWorkerService.GetInvitedWorker({
      userID: this.userID, nameCallCenter: this.nameCallCenter,
      title: this.title, tag: this.tag, PageSize: this.selectedPageSize,
      PageIndex: this.config_InviteWorkerList.currentPage - 1
    }).subscribe(
      (res) => {
        this.inviteResponse = res.inviteRsp as InviteResponse[];
        this.config_InviteWorkerList.totalItems = res.totalCount;

        this.spinner.hide();
        //this.inviteResponse = this.inviteResponse.filter(x => x.senderID == null || x.senderID == this.userID);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  Reset() {
    this.nameCallCenter = "";
    this.title = "";
    this.tag = "";
    this.GetInvitedWorker();
  }
  GetProposalWorker() {
    this.proposalResponse = [];
    this.hiringWorkerService.GetProposalWorker({ CampaignID: this.param }).subscribe(
      (res) => {
        this.spinner.hide();
        this.proposalResponse = res as InviteResponse[];
        debugger
        this.proposalResponse = this.proposalResponse.filter(x => x.compaignID == this.param);
        if (this.proposalResponse.length > 0) {
          this.visibleProposalReview = true;
        }
        else {
          this.visibleProposalReview = false;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  ProfilePopup(obj: InviteResponse) {
    this.profileViewerResponse = [];
    this.profileViewerResponse = this.inviteResponse.filter(
      (x) => x.userID == obj.userID && x.proposalID == obj.proposalID
    );
    this.profileViewerReq = this.profileViewerResponse[0];
    const initialState = {
      profileViewerReq: this.profileViewerReq
    };
    this.bsModalRef = this.modalService.show(ProfilePopupComponent, { initialState });
    const modalWidth = 'modal-lg';
    this.bsModalRef.setClass(modalWidth);
    this.bsModalRef.content.closeBtnName = 'Close';

  }
  ProfileProposalPopup(obj: InviteResponse) {
    this.profileViewerResponse = [];
    this.profileViewerResponse = this.proposalResponse.filter(
      (x) => x.userID == obj.userID && x.proposalID == obj.proposalID
    );
    this.profileViewerReq = this.profileViewerResponse[0];
    const initialState = {
      profileViewerReq: this.profileViewerReq
    };
    this.bsModalRef = this.modalService.show(ProfilePopupComponent, { initialState });
    const modalWidth = 'modal-lg';
    this.bsModalRef.setClass(modalWidth);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  ProfileHiredPopup(obj: ClientHiredRsp) {
    let profileViewerResponse = [];
    let profile: any;
    profileViewerResponse = this.clientHiredRsp.filter(
      (x) => x.hiredID == obj.hiredID && x.compaignID == obj.compaignID
    );

    this.profileViewerReq.coworkerName = profileViewerResponse[0].clientName;
    this.profileViewerReq.designation = profileViewerResponse[0].designation;
    this.profileViewerReq.favUserTechn = profileViewerResponse[0].favUserTechnProfile;
    this.profileViewerReq.sittingCapacity = profileViewerResponse[0].sittingCapacityProfile;
    this.profileViewerReq.profileID = profileViewerResponse[0].profileIDProfile;
    this.profileViewerReq.description = profileViewerResponse[0].descriptionProfile;
    this.profileViewerReq.clientRecive = profileViewerResponse[0].clientReciveProfile;
    this.profileViewerReq.proposalStatus = profileViewerResponse[0].proposalStatusProfile;
    this.profileViewerReq.salesRate = profileViewerResponse[0].salesRateProfile;
    this.profileViewerReq.numberofSales = profileViewerResponse[0].numberofSalesProfile;
    this.profileViewerReq.coverLetter = profileViewerResponse[0].coverLetterProfile;

    this.profileViewerReq.userID = profileViewerResponse[0].clientID;
    const initialState = {
      profileViewerReq: this.profileViewerReq
    };
    this.bsModalRef = this.modalService.show(ProfilePopupComponent, { initialState });
    const modalWidth = 'modal-lg';
    this.bsModalRef.setClass(modalWidth);
    this.bsModalRef.content.closeBtnName = 'Close';
  }

  SendMessage(obj: InviteResponse) {
    this.spinner.show();
    this.messageRqst.compaignID = obj.compaignID;
    this.messageRqst.proposalID = obj.proposalID;
    this.messageRqst.recieverID = obj.userID;
    this.messageRqst.recieverType = 'Call Center';
    this.messageRqst.senderType = 'Post Compaign';
    this.messageRqst.senderID = Number(localStorage.getItem('currentUserNo'));
    this.hiringWorkerService.SendMessage(this.messageRqst).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastr.success('Send Message Successfully');
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  SendInvitation(obj: InviteResponse) {
    this.spinner.show();
    this.invitationRqst.invitationStatus = 'Sended';
    this.invitationRqst.compaignID = this.param;
    this.invitationRqst.proposalID = obj.proposalID;
    this.invitationRqst.recieverID = obj.userID;
    this.invitationRqst.recieverType = 'Call Center';
    this.invitationRqst.senderType = 'Post Compaign';
    this.invitationRqst.senderID = Number(
      localStorage.getItem('currentUserNo')
    );
    this.hiringWorkerService.SendInvitation(this.invitationRqst).subscribe(
      (res) => {
        this.spinner.hide();
        this.GetInvitedWorker();
        this.toastr.success('Request Sent Successfully');
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }

  ShortListCallCenter(obj: InviteResponse) {
    this.spinner.show();
    this.hiredRequest.hireStatus = 'ShortListed';
    this.hiredRequest.compaignID = obj.compaignID;
    this.hiredRequest.proposalID = obj.proposalID;
    this.hiredRequest.hiredByID = Number(localStorage.getItem('currentUserNo'));
    this.hiredRequest.hiredCallerID = obj.userID;
    this.hiredRequest.hiredByType = 'Post Compaign';
    this.hiredRequest.hiredCallerType = 'Call Center';
    this.hiringWorkerService.HiredCallCenter(this.hiredRequest).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastr.success('Shortlisted Successfully');
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  GetHiredRequests() {
    this.spinner.show();
    this.hiringWorkerService.GetHiredRequests(this.userID, "client").subscribe(res => {
      this.spinner.hide();
      debugger
      this.clientHiredRsp = res as ClientHiredRsp[];
      this.rqstrID = this.clientHiredRsp[0].clientID;
      this.clientHiredRsp = this.clientHiredRsp.filter(x => x.compaignID == this.param);
    }, error => {
      this.spinner.hide();
    });
  }
  OpenLeadPopup() {
    this.leadFormPopupOpen();
  }
  leadFormPopupCross() {
    $('#leadpopup').modal('hide');
  }
  leadFormPopupOpen() {
    $('#leadpopup').modal('show');
  }
  leadFormPopupCrossCustomer() {
    $('#leadpopupCustomer').modal('hide');
  }
  leadFormPopupOpenCustomer() {
    $('#leadpopupCustomer').modal('show');
  }
  step2() {
    this.leadFormPopupOpenCustomer();
  }
  addFieldValue(index) {
    if (this.objQstnsLst.length <= 29) {
      this.objQstnsLst.push(this.newAttribute);
      this.newAttribute = {};
    } else {
    }
  }

  deleteFieldValue(index) {
    this.objQstnsLst.splice(index, 1);
  }

  onEditCloseItems() {
    this.isEditItems = !this.isEditItems;
  }
  saveLeadSubForm() {
    this.spinner.show();
    this.hiringWorkerService
      .saveLeadSubForm({
        userID: Number(this.userID),
        compaignID: this.param,
        requestorUserID: this.rqstrID,
        title: this._clientLeadSubRqst.title,
        description: this._clientLeadSubRqst.description,
        customerName: this._clientLeadSubRqst.customerName,
        customerPhnNum: this._clientLeadSubRqst.customerPhnNum,
        zipCode: this._clientLeadSubRqst.zipCode,
        question: this.objQstnsLst,
      })
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.toastr.success('Save Lead Submission Form Successfully');
          this.createForm = false;
          this.leadFormPopupCross();
          this.leadFormPopupCrossCustomer();
          this.getSubmittedLeads();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  getSubmittedLeads() {
    this.spinner.show();
    this.hiringWorkerService.getSubmittedLeads(this.userID, "Client").subscribe(res => {
      this.spinner.hide();
      this.leadSubList = res.obj1;
      this.leadSubQstList = res.obj2;
    }, error => {
      this.spinner.hide();

    });
  }
  updateNotificationEarning() {
    this.spinner.show();
    this.hiringWorkerService.updateNotificationEarning(this.userID).subscribe(
      (res) => {
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  NotSendRqst() {
    this.toastr.error('Call Center Not Yet Send Request');
  }
  
  splitCompaignType(theString: string) {
    if (theString != null) return theString.split(',');
  }
  editable(obj: string) {
    if (obj == 'Pay') {
      this.compaignEditable.payByText = true;
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaignEditable.payPerText = true;
      this.compaign.payPerText = this.compaignResponse.payPerText;
    }
    if (obj == 'price') {
      this.compaignEditable.sale = true;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaignEditable.price = true;
      this.compaign.price = this.compaignResponse.price;
    }
    if (obj == 'desc') {
      this.compaignEditable.desc = true;
      this.compaign.description = this.compaignResponse.description;
    }

    if (obj == 'title') {
      this.compaignEditable.title = true;
      this.compaign.title = this.compaignResponse.title;
    }
    if (obj == 'compaignDuration') {
      this.compaignEditable.compaignDuration = true;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
    }
  }
  updateCompaignInfo(obj: string) {
    debugger
    this.compaign.id = this.compaignResponse.id;
    if (obj == 'Pay') {
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaignEditable.payByText = false;
      this.compaignEditable.payPerText = false;
    }
    if (obj == 'price') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaignEditable.sale = false;
      this.compaignEditable.price = false;
    }
    if (obj == 'desc') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaignEditable.desc = false;
    }
    if (obj == 'title') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaignEditable.title = false;
    }
    if (obj == 'compaignDuration') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.title = this.compaignResponse.title;
      this.compaignEditable.compaignDuration = false;
    }
    this.hiringWorkerService.updateCompaignInfo(this.compaign).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastr.success('Updated Successfully');
        this.GetSingleCompaign(this.compaign.id);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  cancelUpdate(obj: string) {
    if (obj == 'Pay') {
      this.compaignEditable.payByText = false;
      this.compaignEditable.payPerText = false;
    }
    if (obj == 'price') {
      this.compaignEditable.sale = false;
      this.compaignEditable.price = false;
    }
    if (obj == 'desc') {
      this.compaignEditable.desc = false;
    }

    if (obj == 'title') {
      this.compaignEditable.title = false;
    }
    if (obj == 'compaignDuration') {
      this.compaignEditable.compaignDuration = false;
    }
  }
  openContract() {
    this.router.navigate(['/Contracts']);
  }
  openMessages() {
    $("#ProfileModal").modal('hide');
    this.router.navigate(['/message']);
  }

  download(val) {
    window.open(val);
  }
  openPaymentModalPopup() {
    this.hiringWorkerService.CheckPayment({ clientID: this.userID, compaignID: this.param }).subscribe(res => {
      this.spinner.hide();
      if (res == 'Already Exist') {
        this.HiredCallCenter();
      }
      else {
        debugger
        this.payment.amount = this.compaignResponse.totalAmount * 1.03;
        var email = JSON.parse(localStorage.getItem('currentUser'));
        this.payment.userEmail = email.username;
        $('#Billing-payment-details').modal('show');
        $('#ReviewModal').modal('hide');
      }
    }, error => {
      this.spinner.hide();
      alert(error);
    })
  }
  postPayment(cardid, year, month, last4Digit, addressZip, brand, tokenID) {
    debugger;
    this.spinner.show();
    var expiryMonth: number = +month;
    var expiryYear: number = +year;
    var value: number = +this.payment.amount;
    this.payment.expiryMonth = expiryMonth;
    this.payment.expiryYear = expiryYear;
    this.payment.amount = value;
    this.payment.compaignID = this.param;
    this.payment.clientID = this.userID;
    this.payment.callCenterID = this.objHiredCallCenter.userID;
    this.payment.senderType = 'Client';
    this.payment.recieverType = 'Client';
    this.payment.addressZip = addressZip;
    this.payment.lastDigitNumber = last4Digit;
    this.payment.cardid = cardid;
    this.payment.brand = brand;
    this.payment.tokenID = tokenID;

    this.hiringWorkerService.PaymentClient(this.payment).subscribe(res => {
      debugger;
      this.spinner.hide();
      if (res == 'Success') {
        $('#Billing-payment-details').modal('hide');
        this.HiredCallCenter();
      }
      else {
        this.toastr.error("Some error occured!");
      }

    }, error => {
      this.spinner.hide();
      debugger;
      alert(error);
    })

  }
  ReviewModalClose() {
    this.ReviewPopupClose();
  }
  ReviewPopupClose() {
    $('#ReviewModal').modal('hide');
  }
  ReviewPopupOpen(obj: InviteResponse) {
    this.objHiredCallCenter = obj;
    $('#ReviewModal').modal('show');
  }
  HiredCallCenter() {
    this.spinner.show();
    this.hiredRequest.hireStatus = 'Hired Proposal Pending';
    this.hiredRequest.compaignID = this.objHiredCallCenter.compaignID;
    this.hiredRequest.proposalID = this.objHiredCallCenter.proposalID;
    this.hiredRequest.hiredByID = Number(localStorage.getItem('currentUserNo'));
    this.hiredRequest.hiredCallerID = this.objHiredCallCenter.userID;
    this.hiredRequest.hiredByType = 'Post Compaign';
    this.hiredRequest.hiredCallerType = 'Call Center';
    this.hiringWorkerService.HiredCallCenter(this.hiredRequest).subscribe(res => {
      this.spinner.hide();
      this.toastr.success("Hire Request Sended Successfully");
      this.proposalResponse = res;
    }, error => {
      this.spinner.hide();
    })
  }
  paymentModalPopupClose() {
    $('#Billing-payment-details').modal('hide');
  }
  updateProposalStatus(status: string, proposal: InviteResponse) {
    this.hiringWorkerService.updateProposalStatus({
      proposalStatus: status,
      proposalID: proposal.proposalID
    }).subscribe(res => {
      this.spinner.hide();
      if (status == 'Accepted') {
        this.toastr.success("Proposal Accepted and Messages are allowed");
      }
      else {
        this.toastr.success("Proposal Rejected Successfully");
      }
      this.GetProposalWorker();
    }, error => {
      this.spinner.hide();
    })
  }
  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }
  onPageChanged(page) {
    this.config_InviteWorkerList.currentPage = page;
    this.GetInvitedWorker();
  }
}
export class SchedularChat {
  //date: Date;
  from: string;
  to: string;
  messages: Message[] = [];
}
export class RoomDetail {
  from: string;
  to: string;
  room: string;
}
export class UserDetail {
  message: string;
  name: string;
  email: string = '';
  time: string;
  isConnected: boolean = false;
  user: UserInfo;
}
export class Message {
  message: string;
  from: string;
  to: string;
  time: string;
  is_delivered: boolean;
  is_seen: boolean;
}
export class UserInfo {
  userName: string;
  connectionId: string;
}
