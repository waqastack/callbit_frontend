import { Component, OnInit } from '@angular/core';
import { ClientInvitationsRsp, ClientInvitationsRqst, InviteResponse } from 'src/app/models/hiring-user';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

declare var $;
import * as $ from 'jquery';
import { ProfilePopupComponent } from '../common/profile-popup/profile-popup.component';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss']
})
export class InvitationsComponent implements OnInit {
  searchText: any;
  userID: number;
  clientInvitationsRsp: ClientInvitationsRsp[] = [];
  clientInvitationsPndRsp: ClientInvitationsRsp[] = [];
  clientInvitationsAcptRsp: ClientInvitationsRsp[] = [];
  clientInvitationsRjtRsp: ClientInvitationsRsp[] = [];
  clientInvitationsRqst: ClientInvitationsRqst;
  tabStatus: string = 'Sended';
  profilePicture: string = '../../../assets/images/profile-pic.png';
  profileViewerResponse: ClientInvitationsRsp[] = [];
  bsModalRef: BsModalRef;
  profileViewerReq: InviteResponse;
  constructor(private spinner: NgxSpinnerService, private router: Router,
    private _service: HiringWorkerService, private toastr: ToastrService,
    private modalService: BsModalService  ) {
    this.userID= Number(localStorage.getItem('currentUserNo'));
    this.clientInvitationsRsp = [];
    this.clientInvitationsPndRsp = [];
    this.clientInvitationsAcptRsp = [];
    this.clientInvitationsRjtRsp = [];
    this.clientInvitationsRqst = new ClientInvitationsRqst;
    this.profileViewerResponse = [];
    this.profileViewerReq = new InviteResponse();
  }

  ngOnInit(): void {
    this.GetInvitationRequests();
  }
  GetInvitationRequests() {
    this.spinner.show();
    this._service.GetInvitationRequests(this.userID).subscribe(res => {
      this.spinner.hide();
      debugger
      this.clientInvitationsRsp = res as ClientInvitationsRsp[];
      this.clientInvitationsPndRsp = this.clientInvitationsRsp.filter(x => x.invitationStatus == 'Sended');
    }, error => {
      this.spinner.hide();
    });
  }
  InviteCoworkers() {
    return alert('Under Construction');
  }
  ChangeStatus(text: string) {
    if (text == 'Sended') {
      this.tabStatus = 'Sended';
    }
    if (text == 'Accept') {
      this.tabStatus = 'Accept';
      this.clientInvitationsAcptRsp = this.clientInvitationsRsp.filter(x => x.invitationStatus == 'Accept');
    }
    if (text == 'Reject') {
      this.tabStatus = 'Reject';
      this.clientInvitationsRjtRsp = this.clientInvitationsRsp.filter(x => x.invitationStatus == 'Reject');
    }
  }
  UpdateInvitationStatus(invitationID:number,status:string) {
    this.spinner.show();
    this.clientInvitationsRqst.invitationID = invitationID;
    this.clientInvitationsRqst.invitationStatus = status;
    this._service.UpdateInvitationStatus(this.clientInvitationsRqst).subscribe(res => {
      this.spinner.hide();
      this.GetInvitationRequests();
    }, error => {
      this.spinner.hide();
    });
  }
  viewProfile(obj: ClientInvitationsRsp) {
    debugger
    let profileViewerResponse = [];
    let profile: any;
    profileViewerResponse = this.clientInvitationsRsp.filter(
      (x) => x.userID == obj.userID 
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
  ProposalModalClose() {
    $('#ProfileModal').modal('hide');
  }
  ProposalModalOpen() {
    $('#ProfileModal').modal('show');
  }
  GetProfilePicture(userID: number) {
    this.spinner.show();
    this._service.GetProfilePicture(userID).subscribe(
      (res) => {
        this.spinner.hide();
        if (res) {
          this.profilePicture = environment.apiDomain + '/' + res;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  openMessages() {
    this.router.navigate(['/message']);
  }
}
