import { Component, OnInit, OnDestroy} from '@angular/core';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { InviteResponse, InvitationRequest } from 'src/app/models/hiring-user';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfilePopupComponent } from '../common/profile-popup/profile-popup.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Subscriber, Subscription } from 'rxjs';
declare var $;
import * as $ from 'jquery';
@Component({
  selector: 'app-find-call-center',
  templateUrl: './find-call-center.component.html',
  styleUrls: ['./find-call-center.component.scss']
})
export class FindCallCenterComponent implements OnInit, OnDestroy  {
  inviteResponse: InviteResponse[] = [];
  searchText: any;
  invitationRqst: InvitationRequest;
  userID: number;
  profileViewerResponse: InviteResponse[] = [];
  profileViewerReq: InviteResponse;
  profilePicture: string = '../../../assets/images/profile-pic.png';
  bsModalRef: BsModalRef;
  pageOfItems: Array<any>;
  nameCallCenter: string = '';
  title: string = '';
  tag: string = '';
  subscription: Subscription;
  selectedPageSize: number = 10;
  // pagination config data of User group
  config_InviteWorkerList = {
    id: "pg_Worker",
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0
  };
  constructor(private spinner: NgxSpinnerService,
    private router: Router, private hiringWorkerService: HiringWorkerService,
    private toastr: ToastrService, private modalService: BsModalService) {
    this.inviteResponse = [];
    this.invitationRqst = new InvitationRequest();
    this.userID = Number(localStorage.getItem('currentUserNo'));
    this.profileViewerResponse = [];
    this.profileViewerReq = new InviteResponse();
  }

  ngOnInit(): void {
    this.GetInvitedWorker();
  }
  ngAfterViewInit(): void { this.spinner.show(); }
  GetInvitedWorker() {
    this.config_InviteWorkerList.itemsPerPage = this.selectedPageSize;
    this.spinner.show();
    this.subscription =this.hiringWorkerService.GetInvitedWorker({
      userID: this.userID, nameCallCenter: this.nameCallCenter,
      title: this.title, tag: this.tag, PageSize: this.selectedPageSize,
      PageIndex: this.config_InviteWorkerList.currentPage - 1
    }).subscribe(
      (res) => {
        debugger
        this.inviteResponse = res.inviteRsp as InviteResponse[];
        this.config_InviteWorkerList.totalItems = res.totalCount;

        this.spinner.hide();
        //this.inviteResponse = this.inviteResponse.filter(x => x.senderID == null || x.senderID == this.userID);
      },
      (error) => {
      }
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  Reset() {
    this.nameCallCenter = "";
    this.title = "";
    this.tag = "";
    this.GetInvitedWorker();
  }
  InviteCoworkers() {
    return alert('Under Construction');
  }
  SendInvitation(obj: InviteResponse) {
    this.spinner.show();
    this.invitationRqst.invitationStatus = 'Sended';
    this.invitationRqst.compaignID = obj.compaignID;
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
        this.toastr.success('Send Request Successfully');
        this.GetInvitedWorker();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  openMessages() {
    $("#ProfileModal").modal('hide');
    this.router.navigate(['/message']);
  }
  ProposalModalClose() {
    $('#ProfileModal').modal('hide');
  }
  ProposalModalOpen() {
    $('#ProfileModal').modal('show');
  }
  ProfilePopup(obj: InviteResponse) {
    debugger
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
  GetProfilePicture(userID: number) {
    this.spinner.show();
    this.hiringWorkerService.GetProfilePicture(userID).subscribe(

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
  onPageChanged(page) {
    this.config_InviteWorkerList.currentPage = page;
    this.GetInvitedWorker();
  }
  resetPageNo() {
    this.config_InviteWorkerList.currentPage = 1;
  }
}
