import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SignUpRequest } from '../models/user';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private service: GenericService) {}

  login(user, pass): any {
    return this.service.ApiPostMethod('Auth/login', {
      username: user,
      password: pass,
    });
  }
  CheckUserNameDuplication(userName): any {
    return this.service.ApiGetMethod(
      'Auth/CheckUserNameDuplication?_userName=' + userName
    );
  }
  signUp(signUp: SignUpRequest) {
    return this.service.ApiPostMethod('Auth/SignUp', signUp);
  }
  forgotPassword(email: string): Observable<any> {
    return this.service.ApiGetMethod('Auth/ForgotPassword?email=' + email);
  }
  resetPassword(obj): any {
    return this.service.ApiPostMethod('Auth/ResetPassword', obj);
  }

  verifyEmail(e: string, d: string): Observable<any> {
    return this.service.ApiGetMethod('Auth/verifyEmail?link=' + `${d}/${e}`);
  }
  changeType(data: SignUpRequest) {
    return this.service.ApiPostMethod('Auth/ChangeType', data);
  }
  CheckEmail(email: string): any {
    return this.service.ApiGetMethod(
      'Auth/CheckEmail?email=' + email
    );
  }
}
