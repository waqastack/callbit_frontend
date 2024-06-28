import { Component, OnInit } from '@angular/core';
import { CompaignResponse } from 'src/app/models/Compaign';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { CompaignService } from 'src/app/services/compaign.service';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { ClientHiredRsp, ContractSignReq } from 'src/app/models/hiring-user';
import { ToastrService } from 'ngx-toastr';
declare var $;
import * as $ from 'jquery';
@Component({
  selector: 'app-client-contract-sign',
  templateUrl: './client-contract-sign.component.html',
  styleUrls: ['./client-contract-sign.component.scss'],
})
export class ClientContractSignComponent implements OnInit {
  userID: number;
  resContactList: any;
  resCompaignList: any;
  resPendingList: any;
  resCompaignOnGoingLst: any;
  resOnGoingLst: any;
  resStartList: any;
  searchText: any;
  clientHiredRsp: ClientHiredRsp[] = [];
  clientID: number = 0;
  compaignID: number = 0;
  compaignIDOng: number = 0;
  compaignListDDL: any;
  clientListDDL: any;
  _contractSignReq: ContractSignReq;
  resCompaignGenRsp: any;
  btnStart: boolean = true;
  saleTxt: number = 0;
  public ContractID: number;
  public CompaignID: number;
  public CallCenterID: number;
  public ClientID: number;
  public ExpectedLeads: string;
  public SaleSUbmittedStatus: string;
  public comment: string;
  _contractSubmittedReponse: any;
  _contractSubmittedReponseOrg: any;
  exp_Lead: string;
  rem_Leads: string;
  priceTxt: number = 0;
  compaignIDCompleted: number = 0;
  compaignIDCancelled: number = 0;
  compaignLstCompleted: any;
  compaignLstCancelled: any;
  resCompleteLst: any;
  resCancelledLst: any;
  commentTxt: string;
  contractIDFeedback: number = 0;
  contractStatusFeedback: string = "";
  FeedbackContractRsp: any;
  feedBackStatusFlag: boolean = true;
  max = 5;
  rate = 0;
  avgRateStar: '0';
  constructor(
    private service: CompaignService,
    private route: Router,
    private spinner: NgxSpinnerService,
    private hiringWorkerService: HiringWorkerService,
    private toastr: ToastrService
  ) {
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.id;
    this.resContactList = [];
    this.resPendingList = [];
    this.resCompaignList = [];
    this.clientHiredRsp = [];
    this.compaignListDDL = [];
    this.clientListDDL = [];
    this._contractSignReq = new ContractSignReq();
    this.resCompaignOnGoingLst = [];
    this.resOnGoingLst = [];
    this.resStartList = [];
    this.resCompaignGenRsp = [];
    this._contractSubmittedReponse = [];
    this._contractSubmittedReponseOrg = [];
    this.resCompleteLst = [];
    this.resCancelledLst = [];
    this.FeedbackContractRsp = [];
  }
  ngOnInit(): void {
    this.GetContractLists('rqst');
  }
  GetContractLists(tab?: any) {
    this.spinner.show();
    debugger;
    this.hiringWorkerService
      .GetContractLists({ userID: this.userID, compaignID: this.compaignID })
      .subscribe((res) => {
        debugger;
        this.resContactList = [];
        this.resPendingList = [];
        this.resContactList = res.csr;
        this.resCompaignGenRsp = res.cci;
        if (tab == 'rqst') {
          this.resPendingList = this.resContactList.filter(
            (x) => x.contractStatus == 'Pending'
          );
        }
        if (tab == 'ongoing') {
          this.resOnGoingLst = this.resContactList.filter(
            (x) => x.contractStatus == 'Contract Proposal Accepted'
          );
          this._contractSubmittedReponse = res._contractSubmittedReponse;
        }
        if (tab == 'start') {
          this.resStartList = this.resContactList.filter(
            (x) => x.contractStatus == 'Contract Request'
          );
        }
        if (tab == 'completed') {
          this.resCompleteLst = this.resContactList.filter(
            (x) => x.contractStatus == 'Completed'
          );
          this._contractSubmittedReponse = res._contractSubmittedReponse;
        }
        if (tab == 'cancelled') {
          this.resCancelledLst = this.resContactList.filter(
            (x) => x.contractStatus == 'Completed'
          );
          this._contractSubmittedReponse = res._contractSubmittedReponse;
        }
        this.spinner.hide();
      });
  }
  tabSwitch(tab: string) {
    this.resCompaignGenRsp = [];
    this.compaignID = 0;
    if (tab == 'start') {
      this.GetHiredRequests();
    }
    if (tab == 'ongoing') {
      this.GetOnGoingCompaignDDL();
    }
    if (tab == 'completed') {
      this.GetCompletedDDLCompaign();
    }
    if (tab == 'cancelled') {
      this.GetCancelledDDLCompaign();
    }
  }
  GetCompletedDDLCompaign() {
    this.spinner.show();
    debugger
    this.hiringWorkerService
      .GetOnGoingCompaignDDL({ userID: this.userID })
      .subscribe(
        (res) => {
          debugger;
          this.compaignLstCompleted = res.ccc;
          this.compaignLstCompleted = this.compaignLstCompleted.filter(
            (x) => x.status == 'Completed'
          );

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  compaignCompleteChange() {
    this.compaignID = this.compaignIDCompleted;
    this.GetContractLists('completed');
  }
  compaignCancelledChange() {
    this.compaignID = this.compaignIDCancelled;
    this.GetContractLists('cancelled');
  }
  GetCancelledDDLCompaign() {
    this.spinner.show();
    debugger
    this.hiringWorkerService
      .GetOnGoingCompaignDDL({ userID: this.userID })
      .subscribe(
        (res) => {
          debugger;
          this.compaignLstCancelled = res.ccc;
          this.compaignLstCancelled = this.compaignLstCancelled.filter(
            (x) => x.status == 'Cancelled'
          );

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  GetOnGoingCompaignDDL() {
    this.spinner.show();
    debugger;
    this.hiringWorkerService
      .GetOnGoingCompaignDDL({ userID: this.userID })
      .subscribe(
        (res) => {
          debugger;
          this.resCompaignList = res.ccc;
          this.resCompaignOnGoingLst = this.resCompaignList.filter(
            (x) => x.status == 'Contract Proposal Accepted'
          );

          this.spinner.hide();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  GetHiredRequests() {
    this.spinner.show();
    this.hiringWorkerService
      .GetHiredRequests(this.userID, 'CallCenter')
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.clientHiredRsp = res as ClientHiredRsp[];
          debugger;
          this.compaignListDDL = this.clientHiredRsp.filter(
            (x) => x.hireStatus == 'Hired Proposal Accepted'
          );
          this.GetContractLists('start');
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  UpdateContractStatus(obj: any, status: string) {
    this.spinner.show();
    this.hiringWorkerService
      .UpdateContractStatus({
        contractID: obj.contractID,
        status: status,
      })
      .subscribe(
        (res) => {
          this.spinner.hide();
          this.GetContractLists();
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  compaignChange() {
    this.GetContractLists('start');
    this.clientListDDL = this.compaignListDDL.filter(
      (x) => x.compaignID == this.compaignID
    );
  }
  compaignChangeOngoing() {
    this.compaignID = this.compaignIDOng;
    this.GetContractLists('ongoing');
  }
  sendContract() {
    this._contractSignReq.ClientID = this.clientID;
    var x: number = +this.compaignID;
    this._contractSignReq.CompaignID = x;
    this._contractSignReq.CallCenterID = this.userID;
    this._contractSignReq.senderType = 'Call Center';
    this._contractSignReq.recieverType = 'Client';
    this._contractSignReq.notificationCount = 1;
    this._contractSignReq.ContractStatus = 'Contract Request';
    debugger;
    this.hiringWorkerService.saveContractForm(this._contractSignReq).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastr.success('Updated Successfully');
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  clientChange() {
    this.resStartList = this.resStartList.filter(
      (x) => x.compaignID == this.compaignID
    );
    if (
      this.clientID.toString() != '0' &&
      this.compaignID.toString() != '0' &&
      this.resStartList.length == 0
    ) {
      this.btnStart = false;
    } else {
      this.btnStart = true;
    }
  }
  leadPopup(p: any) {
    debugger;
    this.CallCenterID = p.callCenterID;
    this.clientID = p.clientID;
    this.compaignID = p.compaignID;
    this.ContractID = p.contractID;
    $('#leadpopups').modal('show');
  }
  leadPopupCross() {
    $('#leadpopups').modal('hide');
  }
  saveSaleSubmited() {
    this.hiringWorkerService
      .saveSaleSubmited({
        ContractID: this.ContractID,
        CompaignID: this.compaignID,
        CallCenterID: this.CallCenterID,
        ClientID: this.clientID,
        ExpectedLeads: this.saleTxt,
        SaleSUbmittedStatus: 'Pending',
        comment: '',
        price: this.priceTxt
      })
      .subscribe(
        (res) => {
          this.spinner.hide();
          $('#leadpopups').modal('hide');
          this.saleTxt = 0;
          this.toastr.success('Updated Successfully');
        },
        (error) => {
          this.spinner.hide();
        }
      );
  }
  detailOpen(obj: any) {
    debugger;
    this._contractSubmittedReponseOrg = this._contractSubmittedReponse.filter(
      (x) => x.contractID == obj.contractID
    );
    this.exp_Lead = obj.expectedLeads;
    this.rem_Leads = obj.remainingLeads;
    $('#detailContactpopup').modal('show');
  }
  detailContactPopupCross() {
    $('#detailContactpopup').modal('hide');
  }
  ShowFeedBack() {
    this.contractIDFeedback = this.resContactList[0].contractID;
    this.contractStatusFeedback = this.resContactList[0].contractStatus;
    this.rate = 0;
    this.spinner.show();

    this.hiringWorkerService.ShowFeedBack({
      contractID: this.contractIDFeedback,
      senderType: 'Call Center'
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
      CompaignID: this.resContactList[0].compaignID,
      CallCenterID: this.userID,
      ClientID: this.resContactList[0].clientID,
      contractID: this.contractIDFeedback,
      CommentTxt: this.commentTxt,
      senderType: 'Call Center',
      recieverType:'Client'
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
      ContractId: this.contractIDFeedback.toString(),
      RateToId: this.resContactList[0].clientID.toString()
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
    this.spinner.show();
    this.hiringWorkerService.starRateGet({
      Type: "Contract",
      ContractId: this.contractIDFeedback.toString(),
      RateToId: this.resContactList[0].clientID.toString()
    }).subscribe(res => {
      this.spinner.hide();
      this.avgRateStar = res;
    }, error => {
      this.spinner.hide();
    })
  }
}
