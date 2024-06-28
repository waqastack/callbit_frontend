import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Payment} from 'src/app/models/payment.model';
import { ProposalsDetails } from '../models/ProposalsDetails';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=UTF-8',
    'Access-Control-Allow-Origin': environment.apiDomain,
    "Access-Control-Allow-Credentials": "true",
    'Access-Control-Allow-Methods': 'get,post',
    'Accept': 'application/json'
  })
};
const httpOptionsAuth = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    "Access-Control-Allow-Credentials": "true",
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': '*',
    // 'Authorization': "Bearer " + sessionStorage.getItem("AuthToken"),
  })
};
@Injectable({
  providedIn: 'root'
})

export class GenericService {
  readonly baseApiIp: string = environment.apiDomain + '/';
  //readonly basePayIp: string = environment.paymentDomain + '/';
  public list:ProposalsDetails[];

  constructor(private _httpClient: HttpClient) {
   }

  ApiGetMethod(url) {
    let link: string = this.baseApiIp + 'api/' + url;
    return this._httpClient.get(link, httpOptions).pipe(catchError(this.handleError));
  }
  ApiGetProposal(url) {
    debugger
    let link: string = this.baseApiIp + 'api/' + url;
    return  this._httpClient.get(link).toPromise().then(res=> this.list = res as ProposalsDetails[]);
    //return this._httpClient.get(link, httpOptions).pipe(catchError(this.handleError));
  }
  ApiGetProposals(url) {
    debugger
    let link: string = this.baseApiIp + 'api/' + url;
   
    return this._httpClient.get(link, httpOptions).pipe(catchError(this.handleError));
  }

  ApiPostMethod(url, data: any): any {
    let link: string = this.baseApiIp + 'api/' + url;
    return this._httpClient.post(link, data, httpOptions).pipe(catchError(this.handleError));
  }
  ApiPostMethodImages(url, data: any): any {
    let link: string = this.baseApiIp + 'api/' + url;
    console.log(url);
    return this._httpClient.post(link, data).pipe(catchError(this.handleError));
  }
  ApiPostMethodAuth(url, data: any): any {
    let link: string = this.baseApiIp + 'api/' + url;
    return this._httpClient.post(link, data, httpOptions).pipe(catchError(this.handleError));
  }

  ApiDeleteMethod(ControllerName: string, ActionName: string) {
    let url: string = this.baseApiIp + 'api/' + ControllerName + '/' + ActionName;
    return this._httpClient.delete(url, httpOptions).pipe(catchError(this.handleError));
  }

  ApiPutMethod(ControllerName: string, ActionName: string, data: any) {
    let url: string = this.baseApiIp + 'api/' + ControllerName + '/' + ActionName;
    return this._httpClient.put(url, data, httpOptions).pipe(catchError(this.handleError));
  }
  // ApiPaymentPostMethod(url, data: Payment): any {
  //   debugger
  //   let link: string = this.basePayIp + 'api/' + url;
  //   return this._httpClient.post(link, data, httpOptions).pipe(catchError(this.handleError));
  // }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.    
      console.error('An error occurred:', error.error.message);
    } else {
      // the backend returned an unsuccessful response code.    
      // the response body may contain clues as to what went wrong,    
      console.error(`Backend returned code ${error.status}, ` + `body was: ${error.error}`);
      //    if(error.status==401){
      //      window.location.href = window.location.origin + '/Login';
      //    }
    }
    // return an observable with a user-facing error message    
    return throwError('Something bad happened; please try again later.');
  }
}

