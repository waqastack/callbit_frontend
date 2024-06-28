import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { MustMatch, OldPwdValidators, PasswordStrengthValidator } from 'src/app/directies/password-strength.validators';
import { ChangePassword } from 'src/app/models/manage-account';
import { ManageAccountService } from 'src/app/services/manage-account.service';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.css']
})
export class SecurityComponent implements OnInit {
  public passwordForm: FormGroup;
  submitted = false;
  _changePassword:ChangePassword;
  constructor(private fb: FormBuilder, private _manageAccountService: ManageAccountService, private toastr: ToastrService, private spinner: NgxSpinnerService, private route: Router) { 
    this. _changePassword= new ChangePassword();
  }

  ngOnInit(): void {
    // this.passwordForm = this.fb.group({
    //   password: ['', [Validators.required, PasswordStrengthValidator]]
    // });

    this.passwordForm = this.fb.group({
      'oldPassword': ['',Validators.required],
      'newPassword': ['',[Validators.required,Validators.minLength(8),PasswordStrengthValidator]],
      'confirmPassword': ['',Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    });
  }
// convenience getter for easy access to form fields
get f() { return this.passwordForm.controls; }

onSubmit() {
  this.submitted = true;
  let userID=localStorage.getItem('currentUserNo');
  let userName=localStorage.getItem('currentUserName');

  // stop here if form is invalid
  if (this.passwordForm.invalid) {
      return;
  }
  this._changePassword.id=+userID;
  this._changePassword.userName=userName;

  this.spinner.show();
    this._manageAccountService.ChangePassword(this._changePassword).subscribe(res => {
      this.spinner.hide();
      debugger
      if(res!=''){
        this.toastr.success("Change password successfully");
        this.onReset();
      }else{
        this.toastr.error("Old password is invalid, please type correct old password");
        this.onReset();
      }
    }, error => {
      this.spinner.hide();

    });

  // display form values on success
  //alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.passwordForm.value, null, 4));
}

onReset() {
  this.submitted = false;
  this.passwordForm.reset();
}

}
