import { Component, OnInit, Inject } from '@angular/core';
import { CompaignResponse } from 'src/app/models/Compaign';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CompaignService } from 'src/app/services/compaign.service';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import 'moment-range';
import { TimeZoneService } from 'src/app/services/time-zone.service';
import * as moment from 'moment-timezone';
import { Moment } from 'moment';
import {
  ClientHiredRsp, ContractSignReq
} from 'src/app/models/hiring-user';
import { ToastrService } from 'ngx-toastr';
declare var $;
import * as $ from 'jquery';
@Component({
  selector: 'app-contract-sign',
  templateUrl: './contract-sign.component.html',
  styleUrls: ['./contract-sign.component.scss']
})
export class ContractSignComponent implements OnInit {
  callCenterClientRespOrg: any;
  callCenterClientResp: any;
  callCenterCompletedClientResp: any;
  callCenterCompletedClientRespOrg: any;
  callCenterCancelledClientResp: any;
  callCenterCancelledClientRespOrg: any;
  compaignClientResp: any;
  compaignCompletedClientResp: any;
  compaignCompletedClientRespOrg: any;
  compaignCancelledClientResp: any;
  compaignCancelledClientRespOrg: any;
  compaignClientRespOrg: any;
  ContractClientRsp: any;
  ContractClientRspOrg: any;
  compaignIDClient: number = 0;
  callCenterUsrID: number = 0;
  userID: number;
  isShow: boolean = false;
  _compaign: CompaignResponse;
  selectedID: number;
  clientHiredRsp: ClientHiredRsp[] = [];
  public tzNames: string[];
  _contractSignReq: ContractSignReq;
  compaignID: number = 0;
  resCompaignGenRsp: any;
  compaignIDOng: number = 0;
  saleSubmittedIDSale: number = 0;
  contractIDSale: number = 0;
  saleTotal: number = 0;
  commentsTxt: string = '';
  _contractSubmittedReponse: any;
  _contractSubmittedReponseOrg: any;
  disableLeadsTxt: boolean = true;
  compaignIDCompleted: number = 0;
  callCenterIDCompleted: number = 0;
  compaignIDCancelled: number = 0;
  callCenterIDCancelled: number = 0;
  exp_Lead: string;
  rem_Leads: string;
  commentTxt: string;
  contractIDFeedback: number = 0;
  contractStatusFeedback: string = "";
  FeedbackContractRsp: any;
  feedBackStatusFlag: boolean = true;
  max = 5;
  rate = 0;
  avgRateStar: '0';
  constructor(private service: CompaignService, private route: Router,
    @Inject('TimeZoneService') private timeZoneService: TimeZoneService,
    private spinner: NgxSpinnerService, private hiringWorkerService: HiringWorkerService,
    private toastr: ToastrService) {
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.id;
    this._compaign = new CompaignResponse();
    this.tzNames = moment.tz.names();
    this.clientHiredRsp = [];
    this._contractSignReq = new ContractSignReq;
    this._contractSignReq.CallCenterID = 0;
    this._contractSignReq.StartTime = '18:00';
    this._contractSignReq.EndTime = '20:00';
    this.callCenterClientRespOrg = [];
    this.callCenterClientResp = [];
    this.compaignClientResp = [];
    this.ContractClientRsp = [];
    this.ContractClientRspOrg = [];
    this.compaignClientRespOrg = [];
    this.resCompaignGenRsp = [];
    this._contractSubmittedReponse = [];
    this._contractSubmittedReponseOrg = [];
    this.FeedbackContractRsp = [];
  }
  compaign: CompaignResponse[] = [];
  ngOnInit(): void {
    this.GetLoginUserCompaign('Active');
  }
  tabSwitch(tab: string) {
    this.compaignID = 0;
    this.resCompaignGenRsp = [];
    if (tab == 'ongoing') {
      this.callCenterClientResp = [];
      this.callCenterClientRespOrg = [];
      this.compaignIDClient = 0;
      this.callCenterUsrID = 0;
      this.GetOnGoingDDLClient();
    }
    if (tab == 'completed') {
      this.GetCompletedDDLClient();
    }
    if (tab == 'cancelled') {
      this.GetCancelledDDLClient();
    }
    if (tab == 'start'){
      this.GetLoginUserCompaign('Active');
    }
  }
  compaignChange() {
    this.clientHiredRsp = [];
    this.GetContractClient('start');
  }
  compaignCompleteChange() {
    this.clientHiredRsp = [];
    this.compaignID = this.compaignIDCompleted;
    this.callCenterCompletedClientRespOrg = this.callCenterCompletedClientResp.filter(x => x.status == 'Completed' && x.compaignID == this.compaignIDCompleted);
    //this.GetContractClient('completed');
  }
  compaignCancelledChange() {
    this.clientHiredRsp = [];
    this.compaignID = this.compaignIDCancelled;
    this.callCenterCancelledClientRespOrg = this.callCenterCancelledClientResp.filter(x => x.status == 'Cancelled' && x.compaignID == this.compaignIDCancelled);
  }
  callCenterCompletedChange() {
    this.GetContractClient('completed');
  }
  callCenterCancelledChange() {
    this.GetContractClient('cancelled');
  }
  GetHiredRequests() {
    this.spinner.show();
    debugger
    this.hiringWorkerService.GetHiredRequests(this.userID, "client").subscribe(res => {
      this.spinner.hide();
      debugger
      this.clientHiredRsp = res as ClientHiredRsp[];
      this.clientHiredRsp = this.clientHiredRsp.filter(x => x.compaignID == this.compaignID);
      //this.rqstrID = this.clientHiredRsp[0].clientID;   
    }, error => {
      this.spinner.hide();
    });
  }
  GetLoginUserCompaign(status: string) {
    debugger;
    this.service.GetLoginUserCompaign({ userID: this.userID, status: status }).subscribe(res => {
      this.compaign = res as CompaignResponse[];
      if (this.compaign.length > 0) {
        this.isShow = true;
      }
    }, error => {
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
  ContractPopupCross() {
    this.ContractModalClose();
  }
  ContractModalClose() {
    $('#Contractpopup').modal('hide');
  }
  ContractModalOpen() {
    if (this.compaignID == 0 || this._contractSignReq.CallCenterID == 0) {
      this.toastr.error("Please Select Sompaign And Call Center");
    }
    else {
      let rst:any = this.compaign.filter(x => x.id == this.compaignID)[0];
      if (rst.payByText == 'Pay By the Sales') {
        this._contractSignReq.ExpectedLeads = rst.sale.toString();
        this.disableLeadsTxt = true;
      }
      else {
        this.disableLeadsTxt = false;
        this._contractSignReq.ExpectedLeads = "";
      }
      this._contractSignReq.Days = 0;
      if (rst.compaignDuration == 'Less than 7 days') {
        this._contractSignReq.Days = 7;
      }
      if (rst.compaignDuration == 'Less than 1 months') {
        this._contractSignReq.Days = 30;
      }
      if (rst.compaignDuration == 'Less than 3 months') {
        this._contractSignReq.Days = 90;
      }
      if (rst.compaignDuration == '3 to 6 months') {
        this._contractSignReq.Days = 180;
      }
      $('#Contractpopup').modal('show');
    }
  }
  saveContractForm() {
    this._contractSignReq.ClientID = this.userID;
    var x: number = +this.compaignID;
    this._contractSignReq.CompaignID = x;
    var y: number = +this._contractSignReq.CallCenterID;
    this._contractSignReq.CallCenterID = y;
    this._contractSignReq.senderType = 'Client';
    this._contractSignReq.recieverType = 'Call Center';
    this._contractSignReq.notificationCount = 1;
    this._contractSignReq.ContractStatus = 'Pending';
    debugger
    this.hiringWorkerService.saveContractForm(this._contractSignReq).subscribe(res => {
      this.spinner.hide();
      this.toastr.success("Updated Successfully");
      this.ContractModalClose();
    }, error => {
      this.spinner.hide();
    })
  }
  openPopupUpContract() {
    this.ContractModalOpen();
  }
  GetCompletedDDLClient() {
    this.spinner.show();
    debugger
    this.hiringWorkerService.GetOnGoingDDLClient({ userID: this.userID }).subscribe(res => {
      this.callCenterCompletedClientResp = res.callCenterClientResp;
      this.compaignCompletedClientResp = res.compaignClientResp;
      //this.callCenterCompletedClientRespOrg = this.callCenterCompletedClientResp.filter(x => x.status == 'completed');
      this.compaignCompletedClientRespOrg = this.compaignCompletedClientResp.filter(x => x.status == 'Completed');
      this.spinner.hide();
    }, error => {
      this.spinner.hide();

    })
  }
  GetCancelledDDLClient() {
    this.spinner.show();
    debugger
    this.hiringWorkerService.GetOnGoingDDLClient({ userID: this.userID }).subscribe(res => {
      this.callCenterCancelledClientResp = res.callCenterClientResp;
      this.compaignCancelledClientResp = res.compaignClientResp;
      //this.callCenterCancelledClientRespOrg = this.callCenterCancelledClientResp.filter(x => x.status == 'cancelled');
      this.compaignCancelledClientRespOrg = this.compaignCancelledClientResp.filter(x => x.status == 'Cancelled');

      this.spinner.hide();
    }, error => {
      this.spinner.hide();

    })
  }
  GetOnGoingDDLClient() {
    this.spinner.show();
    debugger
    this.hiringWorkerService.GetOnGoingDDLClient({ userID: this.userID }).subscribe(res => {
      this.callCenterClientResp = res.callCenterClientResp;
      this.compaignClientResp = res.compaignClientResp;
      //this.callCenterClientRespOrg = this.callCenterClientResp.filter(x => x.status == 'Contract Proposal Accepted');
      this.compaignClientRespOrg = this.compaignClientResp.filter(x => x.status == 'Contract Proposal Accepted');

      this.spinner.hide();
    }, error => {
      this.spinner.hide();

    })
  }
  GetContractClient(tab?: any) {
    this.spinner.show();
    debugger
    this.hiringWorkerService.GetContractClient({ userID: this.userID, compaignID: this.compaignID, typeTab: tab }).subscribe(res => {
      if (tab == 'start') {
        this.resCompaignGenRsp = res.cci;
        this.GetHiredRequests();
      }
      else if (tab == 'ongoing') {
        this.resCompaignGenRsp = res.cci;
        this.ContractClientRsp = res.contractClientRsp;
        this.resCompaignGenRsp = res.cci;
        this._contractSubmittedReponse = res._contractSubmittedReponse;
        this.ContractClientRspOrg = this.ContractClientRsp.filter(x => x.contractStatus == 'Contract Proposal Accepted');
      }
      else if (tab == 'completed') {
        this.resCompaignGenRsp = res.cci;
        this.ContractClientRsp = res.contractClientRsp;
        this.resCompaignGenRsp = res.cci;
        this._contractSubmittedReponse = res._contractSubmittedReponse;
        this.ContractClientRspOrg = this.ContractClientRsp.filter(x => x.contractStatus == 'Completed');
      }
      else if (tab == 'cancelled') {
        this.resCompaignGenRsp = res.cci;
        this.ContractClientRsp = res.contractClientRsp;
        this.resCompaignGenRsp = res.cci;
        this._contractSubmittedReponse = res._contractSubmittedReponse;
        this.ContractClientRspOrg = this.ContractClientRsp.filter(x => x.contractStatus == 'Cancelled');
      }
      this.spinner.hide();
    }, error => {
      this.spinner.hide();

    })
  }
  onchangeCompaign() {
    debugger
    this.callCenterClientRespOrg = this.callCenterClientResp.filter(x => x.compaignID ==
      this.compaignIDClient && x.callCenterUsrID != this.userID);
    this.compaignID = this.compaignIDClient;
  }
  onchangeCallCenter() {
    var callCenterUsrIDN: number = +this.callCenterUsrID;
    var compaignIDClientN: number = +this.compaignIDClient;
    this.GetContractClient('ongoing');
    this.ContractClientRspOrg = this.ContractClientRsp.filter(x => x.compaignID == compaignIDClientN &&
      x.callCenterID == callCenterUsrIDN && x.contractStatus == 'Contract Proposal Accepted')
  }
  ActionDone(tab: string, obj: any) {

    this.hiringWorkerService.updateSaleSubmitedStatus({
      saleSubmittedIDSale: obj.saleSubmittedID,
      contractIDSale: this.contractIDSale,
      saleTotal: obj.expectedLeads,
      statusSaleApproval: tab,
      commentsTxt: obj.comment
    }).subscribe(res => {
      this.spinner.hide();
      $('#detailContactpopup').modal('hide');
      this.commentsTxt = '';
      this.toastr.success("Updated Successfully");
    }, error => {
      this.spinner.hide();
    })
  }
  detailContactCross() {
    $('#detailContactpopup').modal('hide');
  }
  detailOpen(obj: any) {
    debugger;
    this.contractIDSale = obj.contractID;
    this._contractSubmittedReponseOrg = this._contractSubmittedReponse.filter(x => x.contractID == this.contractIDSale);
    this.exp_Lead = obj.expectedLeads;
    this.rem_Leads = obj.remainingLeads;

    $('#detailContactpopup').modal('show');
  }
  StatusContractChange(status: string) {
    this.hiringWorkerService.StatusContractChange({
      compaignID: this.compaignIDClient,
      callCenterUsrID: this.callCenterUsrID,
      statusContract: status
    }).subscribe(res => {
      this.spinner.hide();
      if (status == 'Completed')
        this.toastr.success("Completed Successfully");
      if (status == 'Cancelled')
        this.toastr.success("Cancelled Successfully");
    }, error => {
      this.spinner.hide();
    })
  }
  ShowFeedBack() {
    this.contractIDFeedback = this.ContractClientRsp[0].contractID;
    this.contractStatusFeedback = this.ContractClientRsp[0].contractStatus;
    this.rate = 0;
    this.spinner.show();
    this.hiringWorkerService.ShowFeedBack({
      contractID: this.contractIDFeedback,
      senderType:'Client'
    }).subscribe(res => {
      this.spinner.hide();
      debugger
      this.feedBackStatusFlag = res.feedBackStatusFlag;
      this.FeedbackContractRsp = res.feedbackContractRsp;
      this.starRateGet();
    }, error => {
      this.spinner.hide();
    })
  }
  addComment() {
    this.hiringWorkerService.FeedbackContract({
      CompaignID: this.resCompaignGenRsp.compaignID,
      CallCenterID: this.callCenterIDCompleted,
      ClientID: this.userID,
      contractID: this.contractIDFeedback,
      CommentTxt: this.commentTxt,
      senderType: 'Client',
      recieverType:'Call Center'
    }).subscribe(res => {
      this.spinner.hide();
      if (res == 'Inserted') {
        this.commentTxt = "";
        this.toastr.success("Feedback Added Successfully");
      }
      this.ShowFeedBack();
    }, error => {
      this.spinner.hide();
    })
  }
  starRateInsert(): void {
    this.hiringWorkerService.starRateInsert({
      StarRate: this.rate.toString(),
      RateById: this.userID.toString(),
      ContractId: this.ContractClientRsp[0].contractID.toString(),
      RateToId: this.callCenterIDCompleted.toString()
    }).subscribe(res => {
      this.spinner.hide();
      if (res == 'Inserted') {
        this.commentTxt = "";
        this.toastr.success("Star Rate Added Successfully");
      }
      this.starRateGet();
    }, error => {
      this.spinner.hide();
    })
  }
  starRateGet() {
    this.hiringWorkerService.starRateGet({
      Type: "Contract",
      RateToId: this.callCenterIDCompleted.toString(),
      ContractId: this.ContractClientRsp[0].contractID.toString()
    }).subscribe(res => {
      this.spinner.hide();
      this.avgRateStar = res;
    }, error => {
      this.spinner.hide();
    })
  }
}
