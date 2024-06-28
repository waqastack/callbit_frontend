import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SignUpRequest2 } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { environment } from '../../../../environments/environment';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  type: number;
  changeType: Boolean;
  profilePic: string = '../../../assets/images/avatar.jpg';
  userName: string = '';
  activeNotificationCount: number = 0;
  allNotificationCount: number = 0;
  NotificationsResponse: any[];
  subscription: Subscription;
  private ngUnsubscribe = new Subject();
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: AuthService,
    private profileService: ProfileService, private hiringWorkerService: HiringWorkerService
  ) {
    this.changeType = JSON.parse(sessionStorage.getItem('type'));
    const currentUser = this.authenticationService.currentUserValue;
    if (currentUser.type) {
      this.type = currentUser.type;
      this.userName = currentUser.fullName;
    }
    this.GetProfilePicture();
    this.NotificationsResponse = [];
  }

  switchClick() {

    var user = new SignUpRequest2();
    let type = this.type == 1 ? 2 : 1;
    user.type = type;
    user.id = this.authenticationService.currentUserValue.id;
    user.stepWizard = false;
    this.userService.changeType(user).subscribe(res => {
      if (res) {
        this.type = user.type;
        sessionStorage.setItem('type', user.type.toString());
        this.router.navigate(['/home']);
      }
    }, ((err: HttpErrorResponse) => alert(err.message)))
  }

  ngOnInit(): void {
    this.ShowEmailVerificationReminder();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
  isEmailNotVerified: boolean;
  ShowEmailVerificationReminder() {
    try {
      const emailStatus = JSON.parse(localStorage.getItem('isEmailVerified'));
      this.isEmailNotVerified = !emailStatus;
    } catch { }
  }
  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
  setting() {
    this.router.navigate(['/setting']);
  }
  GetActiveNotifications() {
    const userId: any = this.authenticationService.currentUserValue.id;
    this.subscription =this.hiringWorkerService.GetActiveNotifications(userId).subscribe(res => {
      this.activeNotificationCount = res as number;
    }, error => {
    });
  }
  GetProfilePicture() {
    this.subscription = this.profileService.GetProfilePicture(this.authenticationService.currentUserValue.id).subscribe(res => {
      if (res) {
        this.profilePic = res;
      }
      this.GetActiveNotifications();
    }, error => {
    });
  }
  GetAllNotifications() {
    const userId: any = this.authenticationService.currentUserValue.id;
    this.hiringWorkerService.GetAllNotifications(userId).subscribe((res: any) => {
      debugger
      this.NotificationsResponse = res.notificationsResponse;
      this.allNotificationCount = res.allNotificationCount as number;
      this.activeNotificationCount = res.activeNotificationCount as number;
    }, error => {
    });
  }
  ViewAll() {
    this.router.navigate(["Notifications"]);
  }
}


