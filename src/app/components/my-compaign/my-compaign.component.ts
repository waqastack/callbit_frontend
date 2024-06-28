import { Component, OnInit } from '@angular/core';
import { CompaignResponse } from 'src/app/models/Compaign';
import { Router } from '@angular/router';
import { CompaignService } from 'src/app/services/compaign.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { EditCompaignComponent } from '../common/edit-compaign/edit-compaign.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
declare var $;
import * as $ from 'jquery';
import { ConfirmWindowComponent } from '../common/confirm-window/confirm-window.component';

@Component({
  selector: 'app-my-compaign',
  templateUrl: './my-compaign.component.html',
  styleUrls: ['./my-compaign.component.css']
})
export class MyCompaignComponent implements OnInit {
  userID: number;
  isShow: boolean = false;
  _compaign: CompaignResponse;
  selectedID: number;
  bsModalRef: BsModalRef;
  compaign: CompaignResponse[] = [];
  statusActive: boolean = true;
  activeCount: number = 0;
  inactiveCount: number = 0;
  constructor(private service: CompaignService, private route: Router, private spinner: NgxSpinnerService,
    private authenticationService: AuthenticationService, private modalService: BsModalService, private toastr: ToastrService) {
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.id;
    this._compaign = new CompaignResponse();
    const currentUser = this.authenticationService.currentUserValue;
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
    this.GetLoginUserCompaign('Active');
  }
  GetLoginUserCompaign(status: string) {
    debugger;
    if (status == 'Active')
      this.statusActive = true;
    else
      this.statusActive = false;
    this.spinner.show();
    this.service.GetLoginUserCompaign({ userID: this.userID, status: status }).subscribe(res => {
      this.compaign = res.campaign as CompaignResponse[];
      this.inactiveCount = res.inactiveCampaignCount;
      this.activeCount = res.activeCampaignCount;
      this.spinner.hide();
      if (this.compaign.length > 0) {
        this.isShow = true;
      }
    }, error => {
      this.spinner.hide();
    })
  }
  DetailCompaign(id) {
    debugger
    if (id) {
      this._compaign = this.compaign.find(x => x.id == id);
      if (this._compaign) {
        this.selectedID = this._compaign.id;
        this.route.navigate(['/detail', this.selectedID]); // navigate to other page
      }
    }
  }
  splitCompaignType(theString: string) {
    if (theString != null) return theString.split(',');
  }
  editCompaignPopup(id, status) {
    debugger
    const initialState = {
      compaignID: id
    };
    this.bsModalRef = this.modalService.show(EditCompaignComponent, { initialState });
    const modalWidth = 'modal-lg';
    this.bsModalRef.setClass(modalWidth);
    this.bsModalRef.content.closeBtnName = 'Close';
  }
  deleteCompaignPopup(id,status) {
    debugger
    const initialState = {
      id: id
    };
    this.bsModalRef = this.modalService.show(ConfirmWindowComponent, { initialState });
    const modalWidth = 'modal-sm';
    this.bsModalRef.setClass(modalWidth);
    this.bsModalRef.content.closeBtnName = 'Close';
    this.bsModalRef.content.onClose.subscribe(result => {
      this.toastr.success('Compaign Deleted Successfully');
      this.GetLoginUserCompaign(status);
    })
  }
  ChangeCampaignStatus(campaignID,status) {
    this.spinner.show();
    debugger
    this.service.ChangeCampaignStatus({ campaignID: campaignID, status: status }).subscribe(res => {
      this.GetLoginUserCompaign(status);
    }, error => {
      this.spinner.hide();
    })
  }
}
