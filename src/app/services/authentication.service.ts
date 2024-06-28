import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  private compaignSearchSubject: BehaviorSubject<string>;
  public compaignSearch: Observable<string>;
  constructor(private service: AuthService) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
    this.compaignSearchSubject = new BehaviorSubject<string>(
      JSON.parse(localStorage.getItem('currentCompaignSearch'))
    );
    this.compaignSearch = this.compaignSearchSubject.asObservable();

  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string) {
    return this.service.login(username, password).pipe(
      map((user: any) => {
        debugger;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user !== 'Invalid credientials') {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem(
            'isEmailVerified',
            JSON.stringify(user.isEmailVerified)
          );
          let us = user as User;
          localStorage.setItem('currentUserNo', us.id.toString());
          localStorage.setItem('userType', us.type.toString());
          localStorage.setItem('stepWizard', us.stepWizard.toString());
          this.currentUserSubject.next(us);
        }

        return user;
      })
    );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserNo');
    this.currentUserSubject.next(null);
  }
  currentUserValueWizard(value){
    this.currentUserSubject.next(value);
  }
  CheckEmail(username: string) {
    return this.service.CheckEmail(username).pipe(
      map((user: any) => {
        debugger;
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        if (user == 'Yes') {

        }
        else {

        }
      })
    );
  }
  destroyCompaignSearch() {
    // remove user from local storage to log user out
    localStorage.removeItem('compaignSearchable');
    this.compaignSearchSubject.next(null);
  }
  public get currentCompaignValue(): string {
    return this.compaignSearchSubject.value;
  }
}
