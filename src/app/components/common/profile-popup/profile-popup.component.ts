import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { environment } from 'src/environments/environment';
import { PortfolioInfo } from 'src/app/models/profileInfo';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
@Component({
  selector: 'app-profile-popup',
  templateUrl: './profile-popup.component.html',
  styleUrls: ['./profile-popup.component.scss']
})
export class ProfilePopupComponent implements OnInit {
  profileViewerReq: any;
  closeBtnName: string;
  id: number;
  _portfolioInfoo: PortfolioInfo[] = [];
  profilePicture: string = '../../../assets/images/profile-pic.png';
  max = 5;
  rate = 0;
  avgRateStar: '0';
  constructor(public bsModalRef: BsModalRef, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private _profileService: ProfileService, private hiringWorkerService: HiringWorkerService) { }

  ngOnInit(): void {
    this.profileViewerReq = this.profileViewerReq;
    this.GetProfilePicture();
    this.starRateGet();
  }
  GetProfilePicture() {
    this.spinner.show();
    this.id = +this.profileViewerReq.userID;
    this._profileService.GetProfilePicture(this.id).subscribe(
      (res) => {
        this.spinner.hide();
        if (res) {
          this.profilePicture = res;
        }
        this.GetPortfolioInfo();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  GetPortfolioInfo() {
    this.spinner.show();
    this.id = +this.profileViewerReq.profileID;
    this._profileService.GetPortfolioInfo(this.id).subscribe(res => {
      this.spinner.hide();
      if (res.length != 0) {
        this._portfolioInfoo = [];
        for (var item of res) {
          this._profileService.profilePic.next(
            environment.apiDomain + '/' + item.portFolioPath
          );
          item.portFolioPath =  item.portFolioPath;
          this._portfolioInfoo.push(item);
        }
      }
    }, error => {
      this.spinner.hide();

    });
  }
  starRateGet() {
    this.hiringWorkerService.starRateGet({
      Type: "Profile",
      RateToId: this.profileViewerReq.userID.toString(),
      ContractId: ''
    }).subscribe(res => {
      this.spinner.hide();
      this.avgRateStar = res;
      this.rate = Number(this.avgRateStar);
    }, error => {
      this.spinner.hide();
    })
  }
}
