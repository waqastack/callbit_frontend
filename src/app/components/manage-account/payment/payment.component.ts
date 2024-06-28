import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Payment } from 'src/app/models/payment.model';
//import { PaymentService } from 'src/app/services/payment.service';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  payment: Payment;
  constructor(
    private service: HiringWorkerService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.payment = new Payment();
  }

  ngOnInit(): void {}
  expiryDateError: string = '';
  expiryDateTouch: boolean = false;
  expiryDateChange(event) {
    this.expiryDateTouch = true;
    const val = event.target.value;
    this.expiryDateError = '';
    if (!/[0-9{2}/0-9{2}]{5}/.test(val)) this.expiryDateError = 'Invalid entry';
    if (length != 5) return;
    var split = val.split('/');
    if (parseInt(split[0]) > 12 || parseInt(split[0]) < 1)
      this.expiryDateError = 'Month must be between 1-12';
    if (parseInt[split[1]] < 21)
      this.expiryDateError = 'Year must current or greater';
  }

  postPayment() {
    if (this.expiryDateError.length != 0) return;
    this.spinner.show();
    // var expiryMonth: number = +this.payment.expiryMonth;
    // var expiryYear: number = +this.payment.expiryYear;
    var value: number = +this.payment.value;
    var expiryDate = this.payment.expiryDate;
    // this.payment.expiryMonth = expiryMonth;
    // this.payment.expiryYear = expiryYear;
    this.payment.value = value;
    this.service.postPayment(this.payment).subscribe(
      (res) => {
        debugger;
        this.spinner.hide();

        this.router.navigateByUrl('/home');
      },
      (error) => {
        this.spinner.hide();
        debugger;
        alert(error);
      }
    );
  }

}
