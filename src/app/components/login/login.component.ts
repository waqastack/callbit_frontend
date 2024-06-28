import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  @ViewChild('btn', { static: false }) btn: ElementRef;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private profileService: ProfileService
  
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.loginAuth();
  }
  loginAuth() {
    this.spinner.show();
    this.loading = true;
    this.authenticationService
      .login(this.f.username.value, this.f.password.value)
      .subscribe(
        (result) => {
          this.loading = false;
          if (result !== 'Invalid credientials') {
            this.spinner.hide();
            let proPics: any[] = result.profilePic?.result;
            try{this.profileService.profilePic.next(
              `${environment.apiDomain}/${
                proPics[proPics?.length - 1]?.portFolioPath
              }`
            );
            }
            catch{}
            this.toastr.success('login successfully');
            if (result.type == '1') {
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/my';
              this.router.navigate([returnUrl]);
            }
            else if (result.type == '2') {
              const returnUrl =
                this.route.snapshot.queryParams['returnUrl'] || '/home';
              this.router.navigate([returnUrl]);
            }
          }
          else {
            this.spinner.hide();
            this.error = result;
            this.toastr.error(result + '.');
          }
        },
        (error) => {
          this.spinner.hide();
          this.loading = false;
          this.error = error;
          this.toastr.error('Something went wrong.');
        }
      );
  }

  linkedInCredentials = {
    clientId: '773k9ykh33794q',
    redirectUrl: 'http://localhost:4200/login',
    scope: 'r_liteprofile%20r_emailaddress%20w_member_social', // To read basic user profile data and email
  };

  login() {
    let s =
      'https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=773k9ykh33794q&redirect_uri=http://localhost:4200&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social';
    window.location.href = s;
  }

  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;
  auth2: any;
  Name: any;
  linkedInToken: any;
  ngOnInit() {
    this.googleInitialize();
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.linkedInToken = this.route.snapshot.queryParams.returnUrl;

    if (this.linkedInToken) {
      debugger;
      let val;
      this.linkedInToken = this.linkedInToken.split('code=')[1];
      this.linkedInToken = this.linkedInToken.split('&')[0];
      debugger;
    }
  }
  linkedinLogin(token) {}

  googleInitialize() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id:
            '631867203803-gfnbuj33563dmuorhmfm6cv2prqasulq.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email',
        });
        this.prepareLogin();
      });
    };
    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = 'https://apis.google.com/js/platform.js?onload=googleSDKLoaded';
      fjs.parentNode.insertBefore(js, fjs);
    })(document, 'script', 'google-jssdk');
  }

  prepareLogin() {
    this.auth2.attachClickHandler(
      this.loginElement.nativeElement,
      {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        //this.show = true;
        this.Name = profile.getName();
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        this.f.username.setValue(profile.getEmail());
        this.f.password.setValue('isGoogle');
        this.loginAuth();
      },
      (error) => {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }

  onClickEye() {
    let element = document.getElementById('userPassword') as HTMLInputElement;
    if (element.type == 'password') {
      element.type = 'text';
    } else {
      element.type = 'password';
    }
  }
}
