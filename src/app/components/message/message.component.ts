import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { UploadFilesService } from 'src/app/services/upload-files-service';
import { environment } from 'src/environments/environment';
import { GenericService } from '../../services/generic.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  ChatServerUrl = 'https://callbit.com:3000';
  roomDetail: RoomDetail = new RoomDetail();
  hubConnection: signalR.HubConnection;
  message: string = "";
  selectedUser: UserDetail;
  userList: UserDetail[] = [];

  chat: SchedularChat = new SchedularChat();
  constructor(
    private authenticationService: AuthenticationService, private service: GenericService, private _profileService: ProfileService,
    private uploadService: UploadFilesService, private spinner: NgxSpinnerService
    , private toastr: ToastrService, private hiringWorkerService: HiringWorkerService,
    private chng :ChangeDetectorRef
  ) {
    const currentUser = this.authenticationService.currentUserValue;
    this.roomDetail.from = currentUser.username;
    this.getAllowUsers();
    this.startConnection(this.roomDetail.from);
  }

  getAllowUsers() {
    this.service.ApiPostMethod('Auth/GetAllowUser', { from: this.roomDetail.from }).subscribe(res => {
      let usr = res;
      for (let us of usr) {
        let user: UserDetail = new UserDetail();
        if (this.roomDetail.from == us.sender) {
          user.email = us.receiver;
        } else {
          user.email = us.sender;
        }
        this.userList.push(user);

      }
      if (usr.length > 0) {
        this.onUserSelection(0);
        this.userConnection();
      }
      else {
        this.selectedUser = new UserDetail;
      }
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
      let d = data as UserInfo;
      if (d) {
        let e = this.userList.find(x => x.user.connectionId == d.connectionId);
        e.user = null;
        e.isConnected = false;
      }
    });
  }
   listenUser() {
    this.hubConnection.on('ReceiveMessage' , (data) => {
      debugger;

      let d = JSON.parse(data);
      if(this.roomDetail.from==d.to){
        
      if (this.roomDetail.to== d.from) {
        console.log(d);
        let msg = new Message();
        msg.from = d.from;
        msg.to = d.to;
        msg.message = d.message;
        msg.time = new Date().toLocaleTimeString();
        this.chat.messages.push(msg);
       this.chng.detectChanges();
      }
      else{
        debugger;
      }
    }
    });
  }

  ngOnInit(): void {

  }
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  //message = '';

  fileInfos?: Observable<any>;
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
    this.upload();
  }

  upload(): void {
    this.spinner.show();
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      

      if (file) {
        this.currentFile = file;

        this.uploadService.upload(this.currentFile).subscribe(
          (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
              this.spinner.hide();
            } else if (event instanceof HttpResponse) {
              
              let sss="https://callbit.com:3002/files/"+this.currentFile.name;
             let msg = new Message();
             msg.from = this.roomDetail.from;
             msg.to = this.roomDetail.to;
             msg.message = sss;
             msg.time = new Date().toLocaleTimeString();
             this.chat.messages.push(msg);
             this.hubConnection.invoke('NewMessage', this.roomDetail.to, this.roomDetail.from, sss, msg.time);
             this.postMessage(msg);
       
             this.message = "";
             this.spinner.hide();
              //this.message = event.body.message;
              //this.fileInfos = this.uploadService.getFiles();
            }
          },
          (err: any) => {
            console.log(err);
            this.progress = 0;
            this.spinner.hide();
            if (err.error && err.error.message) {
             // this.message = err.error.message;
            } else {
             // this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          });

      }else{
        this.spinner.hide();
      }

      this.selectedFiles = undefined;
    }
  }
   async startConnection(currentUser: string): Promise<void> {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://callbit.com:3000/signalrtc')
      //.withUrl('https://localhost:44327/signalrtc')
      .build();

    await this.hubConnection.start();
    console.log('Connection started');



    // this.getAllChatMessage();


    this.hubConnection.invoke('UserConnected', this.roomDetail.from);

    this.listenUser();
  }

   sendMessageToUser() {
    if (this.message) {
      let msg = new Message();
      msg.from = this.roomDetail.from;
      msg.to = this.roomDetail.to;
      msg.message = this.message;
      msg.time = new Date().toLocaleTimeString();
      this.chat.messages.push(msg);
      this.hubConnection.invoke('NewMessage', this.roomDetail.to, this.roomDetail.from, this.message, msg.time);
      this.sendChatNotification(msg.from, msg.to, msg.message);
      this.message = "";
      this.postMessage(msg);
      
    }
    else {
      this.toastr.error("Message is empty");
    }
  }
  sendChatNotification(from,to,message) {
    this.hiringWorkerService.sendChatNotification({
      from: from,
      to: to,
      message: message
    }).subscribe(res => {
      this.spinner.hide();
      
    }, error => {
      this.spinner.hide();
    })
  }
   onUserSelection(i) {
    this.selectedUser = this.userList[i];
    this.roomDetail.to = this.userList[i].email;
    this.getMessages();
  }

   getAllChatMessage() {
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
   getMessages() {
    this.chat.messages = [];
    this.chat.from = this.roomDetail.from;
    this.chat.to = this.roomDetail.to;
    //getting messages from db

    let json = JSON.stringify(this.chat);
    fetch('https://callbit.com:3001/admin/chat', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',

      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: json
    }).then(response => {
      return response.json();


    }).then(data => {

      debugger;
      this.roomDetail;
      this.chat.messages = data;
    });

  }
   postMessage(msg) {
  
    //getting messages from db

    let json = JSON.stringify(msg);
    fetch('https://callbit.com:3001/admin', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',

      headers: { 'Content-Type': 'application/json' },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: json
    }).then(response => {
      return response.json();


    }).then(data => {
      //this.chat.messages = data;
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
  download(val){
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
