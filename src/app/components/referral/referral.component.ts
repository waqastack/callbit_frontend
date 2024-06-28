import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Referral } from 'src/app/models/referral';
import { AffiliatesService } from 'src/app/services/affilates.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css'],
})
export class ReferralComponent implements OnInit {
  constructor(private affiliateService: AffiliatesService) {}

  ngOnInit(): void {
    this.getInvited();
  }

  //#region INVITED
  invitedList: Referral[] = [];
  invitedError: string = '';

  private getInvited() {
    this.affiliateService
      .getInvited()
      .toPromise()
      .then((x) => {
        this.invitedList = x;
      })
      .catch((err) => {
        this.invitedError = err.error.message;
      });
  }
  //#endregion

  //#region FORM
  emails: string = '';
  emailsError: string = '';
  private emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  submitEmails() {
    this.emailsError = '';
    let emailList = this.emails.split(',');
    emailList = emailList.filter((x) => x != '');
    emailList = emailList.filter(
      (value, index, self) => self.indexOf(value) === index
    );
    if (emailList.length == 0) {
      this.emailsError = 'No Email address entered';
    } else {
      let invalidEmails: string[] = [];
      let validEmails: string[] = [];
      emailList.forEach((email) => {
        email = email.trim();
        if (!this.emailRegex.test(email)) {
          invalidEmails.push(email);
        } else {
          validEmails.push(email);
        }
      });
      if (invalidEmails.length == emailList.length) {
        this.emailsError =
          'All email address(ess) are invalid. Please enter valid email addresses.';
      } else if (invalidEmails.length > 0) {
        this.emailsError =
          'Following email address(ess) are found to be invalid and are excluded.';
        invalidEmails.forEach((invalidEmail) => {
          this.emailsError += ` ${invalidEmail},`;
        });
      }

      if (validEmails.length > 0) {
        //if list has valid email addresses
        //submit emails
        this.affiliateService.inviteByEmailList(validEmails).subscribe({
          next: (response) => {
            this.emails = '';
            this.getInvited();
          },
          error: (err) => {
            this.emailsError = err;
            console.log(this.emailsError);
          },
          complete: () => {
            //close loading
          },
        });
      }
    }
  }
  //#endregion
}
