import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpRequest } from '../models/user';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class AffiliatesService {
  constructor(private service: GenericService) {}

  inviteByEmailList(emails: string[]): Observable<any> {
    return this.service.ApiPostMethod(
      AffiliatesEndPoints.inviteEmailList,
      emails
    );
  }
  getInvited(): Observable<any> {
    return this.service.ApiGetMethod(AffiliatesEndPoints.getInvited);
  }
}

const AffiliatesEndPoints = {
  inviteEmailList: 'Affiliates/inviteByEmailList',
  getInvited: 'Affiliates/GetInvited',
};
