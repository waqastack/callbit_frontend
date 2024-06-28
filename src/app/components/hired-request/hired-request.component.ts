import { Component, OnInit } from '@angular/core';
import { ClientHiredRqst, ClientHiredRsp, LeadSubList, LeadSubQstList, InviteResponse } from 'src/app/models/hiring-user';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { GenericService } from '../../services/generic.service';
import * as signalR from "@aspnet/signalr";
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
declare var $;
import * as $ from 'jquery';
import { ProfilePopupComponent } from '../common/profile-popup/profile-popup.component';
@Component({
  selector: 'app-hired-request',
  templateUrl: './hired-request.component.html',
  styleUrls: ['./hired-request.component.scss']
})
export class HiredRequestComponent implements OnInit {
  searchText: any;
  userID: number;
  clientHiredRsp: ClientHiredRsp[] = [];
  clientHiredRqst: ClientHiredRqst;
  recieverID: number;
  compaignID: number;
  leadSubList: LeadSubList[];
  leadSubQstList: LeadSubQstList[];
  requestFormBtn: boolean = true;
  profilePicture: string = '../../../assets/images/profile-pic.png';
  clientName: string;
  comaignName: string;
  createdDate: string;
  leadSubListSub: LeadSubList[];
  leadSubQstListSub: LeadSubQstList[];
  flag: number = 1;
  emailFrom: string='';
  emailTo: string = '';
  ChatServerUrl = 'http://54.159.110.221:3000';
  roomDetail: RoomDetail = new RoomDetail();
  hubConnection: signalR.HubConnection;
  message: string = "";
  selectedUser: UserDetail;
  userList: UserDetail[] = [];
  chat: SchedularChat = new SchedularChat();
  profileViewerReq: InviteResponse;
  bsModalRef: BsModalRef;
  constructor(private spinner: NgxSpinnerService,
    private route: ActivatedRoute, private router: Router,
    private _service: HiringWorkerService, private toastr: ToastrService,
    private authenticationService: AuthenticationService
    , private service: GenericService, private _profileService: ProfileService,
    private modalService: BsModalService) {
    this.userID = Number(localStorage.getItem('currentUserNo'));
    this.clientHiredRsp = [];
    this.clientHiredRqst = new ClientHiredRqst;
    this.leadSubList = [];
    this.leadSubQstList = [];
    this.leadSubListSub = [];
    this.leadSubQstListSub = [];
    const currentUser = this.authenticationService.currentUserValue;
    this.emailFrom = currentUser.username;
    this.selectedUser = new UserDetail();
    this.profileViewerReq = new InviteResponse();
  }

  ngOnInit(): void {
    this.GetHiredRequests();
  }
  GetHiredRequests() {
    this.spinner.show();
    this._service.GetHiredRequests(this.userID, "CallCenter").subscribe(res => {
      this.spinner.hide();
      debugger
      this.clientHiredRsp = res as ClientHiredRsp[];

      this.getSubmittedLeads();
    }, error => {
      this.spinner.hide();
    });
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
  UpdateHiredStatus(obj: ClientHiredRsp, status: string) {
    this.spinner.show();
    this.clientHiredRqst.hiredID = obj.hiredID;
    this.recieverID = obj.clientID;
    this.compaignID = obj.compaignID;
    this.clientHiredRqst.hireStatus = "Hired Proposal Accepted";
    this.requestFormBtn = true;
    this._service.UpdateHiredStatus(this.clientHiredRqst).subscribe(res => {
      this.spinner.hide();
      debugger
      //this.ProposalModalOpen();
      this.GetHiredRequests();
    }, error => {
      this.spinner.hide();
    });
  }
  ProposalModalClose() {
    $('#MessagingModal').modal('hide');
  }
  ProposalModalOpen() {
    $('#MessagingModal').modal('show');
  }
  NotificationSend() {
    this.spinner.show();
    this._service.NotificationSend({
      compaignID: this.compaignID,
      senderID: this.userID,
      recieverID: this.recieverID
    }).subscribe(res => {
      this.spinner.hide();
      debugger
      this.ProposalModalOpen();
      this.GetHiredRequests();
    }, error => {
      this.spinner.hide();
    });
  }
  getSubmittedLeads() {
    this.spinner.show();
    this._service.getSubmittedLeads(this.userID, "CallCenter").subscribe(res => {
      this.spinner.hide();
      this.leadSubList = res.obj1;
      this.leadSubQstList = res.obj2;
    }, error => {
      this.spinner.hide();

    });
  }
  openMessages() {
    this.router.navigate(['/message']);
  }
  GetProfilePicture(userID: number) {
    this.spinner.show();
    this._service.GetProfilePicture(userID).subscribe(res => {
      this.spinner.hide();
      if (res) {
        this.profilePicture = environment.apiDomain + '/' + res;
      }
    }, error => {
      this.spinner.hide();
    });
  }
  SubmitLeadQst() {
    this.leadSubQstListSub = this.leadSubQstList;
    this.SubmitLeadQstProposalModalOpen();
    this.ProposalModalClose();
  }
  SubmitLeadQstModalClose() {
    $('#EarningModalSubmimQst').modal('hide');
  }
  SubmitLeadQstProposalModalOpen() {
    $('#EarningModalSubmimQst').modal('show');
  }
  SubmitAnswer() {
    let p = this.leadSubQstListSub;
    this.spinner.show();
    this._service.SubmitAnswer(this.leadSubQstListSub).subscribe(res => {
      this.spinner.hide();
      this.toastr.success("Answer submitted");
      this.SubmitLeadQstModalClose();
    }, error => {
      this.spinner.hide();
    });
  }
  TrackLeads(obj: LeadSubList) {
    localStorage.setItem('trackID', obj.leadSubID.toString());
    localStorage.setItem('type', this.flag.toString());
    this.SubmitLeadQstModalClose();
    this.router.navigate(['/TrackLeads']);
  }
  //Chat messages
  getAllowUsers() {
    this.service.ApiPostMethod('Auth/GetAllowUser', { from: this.roomDetail.from }).subscribe(res => {
      let usr = res;
      this.userList = [];
      for (let us of usr) {
        let user: UserDetail = new UserDetail();
        if (this.roomDetail.from == us.sender) {
          user.email = us.receiver;
        } else {
          user.email = us.sender;
        }
        this.userList.push(user);

      }
      var index: number = +this.userList.findIndex(x => x.email == this.emailTo);
      this.onUserSelection(index);
      this.userConnection();
    })

  }
  userConnection() {
    this.hubConnection.on('NewUserConnected', (data) => {

      let d = data as UserInfo;
      if (d) {
        let e = this.userList.find(x => x.email == d.userName);
        e.user = d;
        e.isConnected = true;
        this.hubConnection.invoke('UserConnected', this.roomDetail.from);
      }
    });
    this.hubConnection.on('UserDisconnect', (data) => {
      debugger;
      let d = data as UserInfo;
      if (d) {
        let e = this.userList.find(x => x.user.connectionId == d.connectionId);
        e.user = null;
        e.isConnected = false;
      }
    });
  }
  public listenUser() {
    this.hubConnection.on('ReceiveMessage@' + this.roomDetail.from, (data) => {

      let d = JSON.parse(data);
      if (this.roomDetail.to == d.from) {
        let msg = new Message();
        msg.from = d.from;
        msg.to = d.to;
        msg.message = d.message;
        msg.time = new Date().toLocaleTimeString();
        this.chat.messages.push(msg);

      }
    });
  }
  public async startConnection(currentUser: string): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://54.159.110.221:3000/signalrtc')
      //.withUrl('https://localhost:44327/signalrtc')
      .build();

    await this.hubConnection.start();
    console.log('Connection started');



    // this.getAllChatMessage();


    this.hubConnection.invoke('UserConnected', this.roomDetail.from);

    this.listenUser();
  }

  public sendMessageToUser() {
    let msg = new Message();
    msg.from = this.roomDetail.from;
    msg.to = this.roomDetail.to;
    msg.message = this.message;
    msg.time = new Date().toLocaleTimeString();
    this.chat.messages.push(msg);
    this.hubConnection.invoke('NewMessage', this.roomDetail.to, this.roomDetail.from, this.message, msg.time);


    this.message = "";
  }
  public onUserSelection(i) {
    this.selectedUser = this.userList[i];
    this.roomDetail.to = this.userList[i].email;
    this.getMessages();
  }

  public getAllChatMessage() {
    this.hubConnection.on('AllMessage', (data) => {
      let d = JSON.parse(data);
      if (this.roomDetail.to == d.from) {
        let msg = new Message();
        msg.from = d.from;
        msg.to = d.to;
        msg.message = d.message;
        msg.time = new Date().toLocaleTimeString();
        this.chat.messages.push(msg);

      }
    });
  }
  public getMessages() {
    this.chat.messages = [];
    this.chat.from = this.roomDetail.from;
    this.chat.to = this.roomDetail.to;
    //getting messages from db

    let json = JSON.stringify(this.chat);
    fetch('http://54.159.110.221:3001/admin/chat', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',

      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: json
    }).then(response => {
      return response.json();


    }).then(data => {
      this.chat.messages = data;
    });

  }
  handleFileInput(files) {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    //formData.append('userID',"123");

    this._profileService.UploadMsgAtt(formData).subscribe(res => {
      debugger
      let bb = environment.apiDomain + '/' + res.resturnPath;
      let msg = new Message();
      msg.from = this.roomDetail.from;
      msg.to = this.roomDetail.to;
      msg.message = bb;
      msg.time = new Date().toLocaleTimeString();
      this.chat.messages.push(msg);
      this.hubConnection.invoke('NewMessage', this.roomDetail.to, this.roomDetail.from, bb, msg.time);


      this.message = "";
    }, error => {

    });
  }
  download(val) {
    window.open(val);
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
  email: string='';
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
