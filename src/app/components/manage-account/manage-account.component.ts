import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent implements OnInit {

  constructor( private route: Router) { }

  ngOnInit(): void {
  }
  accountComponent:boolean=false;
  securityComponent:boolean=true;
  formWComponent:boolean=false;
  paymentComponent:boolean=false;
  OpenComponent(event) {
    if (event == 'account') {
      this.accountComponent=true;
      this.securityComponent=false;
      this.formWComponent=false;
      this.paymentComponent=false;
      //this.route.navigate(['/account']); // navigate to other page
    }else if (event == 'security') {
      this.accountComponent=false;
      this.securityComponent=true;
      this.formWComponent=false;
      this.paymentComponent=false;
      //this.route.navigate(['/account']);
    }else if (event == 'payment') {
      this.accountComponent=false;
      this.securityComponent=false;
      this.formWComponent=false;
      this.paymentComponent=true;
      //this.route.navigate(['/account']);
    }
    else{
      this.accountComponent=false;
      this.securityComponent=false;
      this.formWComponent=true;
      this.paymentComponent=false;
      //this.route.navigate(['/account']);
    }
  }
}

