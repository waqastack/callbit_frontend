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
  selector: 'app-find-call-center-no-auth',
  templateUrl: './find-call-center-no-auth.component.html',
  styleUrls: ['./find-call-center-no-auth.component.scss']
})
export class FindCallCenterNoAuthComponent implements OnInit {
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
  compainSingle: any = null;
  message: string;
  constructor(
    private service: CompaignService,
    private spinner: NgxSpinnerService,
    private route: Router,
    public gservice: GenericService,
    private authenticationService: AuthenticationService, private modalService: BsModalService
  ) {
    debugger
    this.message = JSON.parse(localStorage.getItem('compaignSearchable'));
    this._compaign = new CompaignResponse();
    this.lista = new ProposalsDetails();
     this.objProfileRsp = [];
   
  }

  ngOnInit(): void {
    this.GetAllCompaign();
  }
 
  GetAllCompaign() {
    this.spinner.show();
    this.service.getAllCompaign().subscribe(
      (res) => {
        this.compaign = res as CompaignResponse[];
        debugger
        let tempLists: CompaignResponse[] = [];
        if (this.message.length>0) {
          for (let p of this.message) {
            var comp = p;
            let tempList: CompaignResponse[] = [];
            tempList = this.compaign.filter((x) => x.type.includes(comp.toString().trim()));
            tempLists = [...tempList, ...tempLists];
          }
          this.compaign = tempLists;
          this.compaign =Array.from(this.compaign.reduce((m, t) => m.set(t.id, t), new Map()).values());
          this.spinner.hide();
        }
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
        this.CompaignModalOpen();
      }
    }
  }
  GetCompaignDetail() {
    if (this.selectedID) {
      this.CompaignModalClose();
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

}
