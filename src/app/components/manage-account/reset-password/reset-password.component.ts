import { group } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { tap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent implements OnInit {
  password:string;
  confirmPassword:string;
  resetLink: string = null;
  resetForm: FormGroup;
  isPasswordUpdated: boolean;
  show:boolean=false;
  show1:boolean=false;

  constructor(private toastr: ToastrService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    console.log(this.route.snapshot.paramMap.get('d'));
    this.route.queryParamMap.forEach((x) => {
      this.resetLink = `${x.get('e')}/${x.get('d')}`;
    });
  }

  onSubmit() {
    debugger
    if (this.password != this.confirmPassword) {
      this.toastr.error("Password is mismatched");
      return;
    }
    this.auth.resetPassword({Password:this.password,
      ConfirmPassword:this.confirmPassword,ResetLink: this.resetLink})
      .toPromise()
      .then((x) => {
        if (x) {
          this.isPasswordUpdated = true;
          this.toastr.success("Password has been updated");
        } else {
          this.toastr.error("Failed to update password");
        }
      })
      .catch((err) => {
        this.toastr.error("Failed to update password");
      });
  }
  myFunction() {
    this.show = !this.show;
   }
  myFunction1() {
    this.show1 = !this.show1;
  }
}
