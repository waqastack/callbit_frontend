import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Payment } from 'src/app/models/payment.model';
//import { PaymentService } from 'src/app/services/payment.service';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { CompaignService } from 'src/app/services/compaign.service';
import { ToastrService } from 'ngx-toastr';
declare var $;
import * as $ from 'jquery';
@Component({
  selector: 'app-member-ship-proposal',
  templateUrl: './member-ship-proposal.component.html',
  styleUrls: ['./member-ship-proposal.component.scss'],
})
export class MemberShipProposalComponent implements OnInit {
  payments: Payment;
  seletedValue: number;
  valuess: any;
  userID: number;
  constructor(
    private service: HiringWorkerService,
    private eservice: CompaignService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    this.payments = new Payment();
  }

  ngOnInit(): void {
    this.payments.value = 2;
   }


  public onChange(event) {  // event will give you full breif of action
    debugger
    this.valuess = event.target.value;
    //console.log(newVal);
    var val: number = this.valuess;
    this.payments.value = this.valuess;
    this.getValuePkg(this.valuess);
  }
  public getValuePkg(no: any) {
    if (no === "1") {
      this.payments.value = 2;
    } else if (no === "2") {
      this.payments.value = 5;
    } else if (no === "3") {
      this.payments.value = 10;
    }

  }

  openPaymentModalPopup() {
    $('#Billing-payment-details').modal('show');
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.userID = userRst.id;
    this.getUseremail(this.userID);
  }
  ClosePaymentModalPopup() {
    $('#Billing-payment').modal('hide');
  }
  postPayments() {
    debugger
    this.spinner.show();
    var expiryMonth: number = +this.payments.expiryMonth;
    var expiryYear: number = +this.payments.expiryYear;
    var value: number = +this.payments.value;
    var cvc: string = this.payments.cvc;
    this.payments.expiryMonth = expiryMonth;
    this.payments.expiryYear = expiryYear;
    this.payments.cvc = cvc;
    this.payments.value = value;
    this.postPaymen();

  }
  NextPopup1() {
    this.openPaymentModalPopup();
    this.ClosePaymentModalPopup();
  }
  postPaymen() {
    this.service.postPayment(this.payments).subscribe(
      (res) => {
        debugger;
        this.spinner.hide();
        this.toastr.success("Successfully Pay!");
        this.router.navigateByUrl('/home');
      },
      (error) => {
        this.spinner.hide();
        debugger;
        alert(error);
      }
    );
  }

  getUseremail(uid: number) {
    this.eservice.getUserEmail(this.userID).subscribe(
      (res) => {
        debugger
        const a = res;
        this.payments.userEmail = res[0].email;
      });
  }
}