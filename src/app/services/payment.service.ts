import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '../models/payment.model';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  readonly urlPay = 'https://localhost:57972/api/paymentservice/pay';
  constructor(private _httpClient: HttpClient,private service :GenericService) { }

//   postPayment(paymentreq:Payment){

// return this._httpClient.post(this.urlPay,paymentreq);

//   }

postPayment(paymentreq:Payment){
    return this.service.ApiPostMethod('paymentservice/pay',paymentreq);
  }
  
}
