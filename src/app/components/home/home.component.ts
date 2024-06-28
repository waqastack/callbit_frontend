import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompaignResponse } from 'src/app/models/Compaign';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { CompaignService } from 'src/app/services/compaign.service';

declare var $;
import * as $ from 'jquery';
import { ProposalsDetails } from 'src/app/models/ProposalsDetails';
import { GenericService } from 'src/app/services/generic.service';
import { ProfilePopupComponent } from '../common/profile-popup/profile-popup.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  userID: number;
  compaign: CompaignResponse[] = [];
  _compaign: CompaignResponse;
  prop: ProposalsDetails[] = [];
  pflag: boolean = false;
  selectedID: number;
  list: ProposalsDetails;
  lista: ProposalsDetails;
  userType: number;
  skillsKeyword: string[];
  skillsFlag: boolean = true;
  searchCompaign: any;
  pageOfItems: Array<any>;
  bsModalRef: BsModalRef;
  objProfileRsp: any[];
  compaignUserID: number;
  compainSingle: any=null;
  message: string;
  existProposal: boolean = false;
  constructor(
    private service: CompaignService,
    private spinner: NgxSpinnerService,
    private route: Router,
    public gservice: GenericService,
    private authenticationService: AuthenticationService, private modalService: BsModalService
  ) {
    debugger
    this.message = JSON.parse(localStorage.getItem('compaignSearchable'));
    this.authenticationService.destroyCompaignSearch();
    this._compaign = new CompaignResponse();
    this.lista = new ProposalsDetails();
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.userID;
    this.objProfileRsp = [];
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.type) {
      this.userType = currentUser.type;
      if (this.userType==1) {
        this.route.navigate(['/my']);
      }
    }
    var stepWizard = JSON.parse(localStorage.getItem('stepWizard'));
    if (stepWizard == false) {
      const initialState = {
        userType: currentUser.type == 1 ? 'Client' : 'Call Center'
      };
    }
    else {

    }
  }

  ngOnInit(): void {
    this.GetAllCompaign();
    this.GetLoginUserProposalDetails();
  }
  GetLoginUserProposalDetails() {
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.id;

    this.service.getProposalsDetails(this.userID);
    this.getBuyProposal();
  }

 
  getBuyProposal() {
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.id;
    this.service.getProposalsDetailss(this.userID).subscribe(
      (res) => {
        debugger;
        this.lista = res as ProposalsDetails;
        if (this.lista[0].available_proposals <= 0) {
          this.pflag = true;
        }
      },
      (error) => {
      }
    );
  }

  
  GetAllCompaign() {
    this.spinner.show();
    this.service.getAllCompaign().subscribe(
      (res) => {
        this.compaign = res as CompaignResponse[];
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  DetailCompaign(id) {
    debugger
    if (id) {
      this._compaign = this.compaign.find((x) => x.id == id);
      if (this._compaign) {
        this.selectedID = this._compaign.id;
        this.skillsKeyword = this._compaign.type.split(',');
        if (this.skillsKeyword[0] == '') {
          this.skillsFlag = false;
        } else {
          this.skillsFlag = true;
        } 
        this.compainSingle = this._compaign;
        this.compaignUserID = this.compainSingle.userid;
        this.CheckAlreadyProposal(id);
        this.CompaignModalOpen();
      }
    }
  }
  CheckAlreadyProposal(id) {
    this.spinner.show();
    this.service.CheckAlreadyProposal({ UserID: this.userID,CompaignID:id }).subscribe(
      (res) => {
        if (res == 'Not Exist') {
          this.existProposal = false;
        }
        else if (res == 'Already Exist') {
          this.existProposal = true;
        }
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  GetCompaignDetail() {
    if (this.selectedID) {
      this.CompaignModalClose();
      localStorage.setItem("campaignList", JSON.stringify(this._compaign));
      this.route.navigate(['/submitproposal', this.selectedID]); // navigate to other page
    }
  }
  CompaignModalClose() {
    $('#detailCompaignModal').modal('hide');
  }
  CompaignModalOpen() {
    $('#detailCompaignModal').modal('show');
  }
  splitCompaignType(theString: string) {
    if (theString != null) return theString.split(',');
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    debugger
    this.pageOfItems = pageOfItems;
  }
  openProfile() {
    this.userID = this.compaignUserID;
    debugger
    this.service.getProfileInfo(this.userID).subscribe(
      (res) => {
        this.objProfileRsp = res as [];
        var profileViewerReq = {
          coworkerName: this.objProfileRsp[0].userName,
          designation: this.objProfileRsp[0].designation,
          favUserTechn: this.objProfileRsp[0].favUserTechn,
          sittingCapacity: this.objProfileRsp[0].sittingCapacity,
          profileID: this.objProfileRsp[0].profileID,
          description: this.objProfileRsp[0].description,
          clientRecive: null,
          proposalStatus: null,
          salesRate: null,
          numberofSales: null,
          coverLetter: null,
          userID: this.objProfileRsp[0].userID
        };
        const initialState = {
          profileViewerReq: profileViewerReq
        };
        this.bsModalRef = this.modalService.show(ProfilePopupComponent, { initialState });
        const modalWidth = 'modal-lg';
        this.bsModalRef.setClass(modalWidth);
        this.bsModalRef.content.closeBtnName = 'Close'
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  downloadDocFile() {
    debugger
    let filepdf = this._compaign.uploadFile;
    let a = document.createElement('a');
    a.href = filepdf;
    a.download = 'test';
    a.click();
  }
  ViewProposal() {
    this.CompaignModalClose();
    let b = this.selectedID;
    let newRelativeUrl = this.route.createUrlTree(['/Proposal', this.selectedID]);
    let baseUrl = window.location.href.replace(this.route.url, '');

    window.open(baseUrl + newRelativeUrl, '_blank');
  }
}
