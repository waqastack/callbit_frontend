import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailComponent implements OnInit {
  searchNotification: '';
  NotificationsResponse: any[];
  NotificationsResponseBkp: any[];
  NotificationsTypeResponse: any[];
  pageOfItems: Array<any>;
  category: string = 'All';
  constructor(private router: Router,
    private authenticationService: AuthenticationService, private spinner: NgxSpinnerService,
    private hiringWorkerService: HiringWorkerService) {
    this.NotificationsResponse = [];
    this.NotificationsResponseBkp = [];
    this.NotificationsTypeResponse = [];
  }

  ngOnInit(): void {
    this.GetAllNotificationsList();
  }
  GetAllNotificationsList() {
    this.spinner.show();
    const userId: any = this.authenticationService.currentUserValue.id;
    this.hiringWorkerService.GetAllNotificationsList(userId).subscribe((res: any) => {
      this.spinner.hide();
      debugger
      this.NotificationsResponse = res.notificationsResponse;
      this.NotificationsResponseBkp = res.notificationsResponse;
      this.NotificationsTypeResponse = res.notificationsTypeResponse;
    }, error => {
      this.spinner.hide();
    });
  }
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    debugger
    this.pageOfItems = pageOfItems;
  }
  UnderConstruction() {
    alert("Under Development");
    return false;
  }
  SelectCategory(type:any)
  {
    if (type == 'All') {
      this.category = type;
      this.NotificationsResponse = this.NotificationsResponseBkp;
    }
    else {
      this.category = type;
      this.NotificationsResponse = this.NotificationsResponseBkp.filter(x => x.notificationType==type);
    }
  }
}
