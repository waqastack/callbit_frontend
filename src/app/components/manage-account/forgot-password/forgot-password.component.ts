import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
const email_validator_regex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: this.fb.control(''),
    });
  }
  form: FormGroup;
  emailError: string = '';
  isEmailSent: boolean = false;
  ngOnInit(): void {}

  onSubmit() {
    this.emailError = '';
    const email = this.form.value.email;
    // if (!email_validator_regex.test(email)) {
    //   this.emailError = 'Please enter a valid email address';
    //   return;
    // }
    this.auth
      .forgotPassword(email)
      .toPromise()
      .then((x) => {
        if (x) {
          this.isEmailSent = true;
        } else {
          this.emailError = 'Failed to send email due to unknown reasons';
        }
      })
      .catch((err) => {
        this.emailError = 'Failed to send email due to unknown reasons';
      });
  }
}
