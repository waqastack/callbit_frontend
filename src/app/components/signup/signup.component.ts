import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { SignUpRequest } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InputValidations } from 'src/app/services/input-validation';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  registerForm: FormGroup;
  step1: boolean = true;
  step2: boolean = false;
  inputV:InputValidations;
  email: string = "";
  username: string = "";
  password: string = "";
  register: SignUpRequest;
  isLinkedIn: boolean = false;
  isGoogle: boolean = false;
  type:number=1;
  constructor(private router: Router,
    private formBuilder: FormBuilder, private authenticationService: AuthenticationService, private service: AuthService,private toastr: ToastrService,
    private route: ActivatedRoute, private spinner: NgxSpinnerService,
    ) {


    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/home']);
    }
  }

  validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
join() {
  debugger;
  if (this.email == "") {
    return;
  }

  if (!this.validateEmail(this.email)) {
    document.getElementById('joinedEmail').classList.add('alert-danger')
  }
  else
  {
    this.CheckEmail();
  }
}
CheckEmail() {
  debugger
  this.spinner.show();
  this.service.CheckEmail(this.email)
    .subscribe
    (result => {
      this.spinner.hide();
      if (result == 'Yes') {
        this.toastr.error("Email already exist.");
      }
      else {
        document.getElementById('joinedEmail').classList.remove('alert-danger')
        this.step1 = false;
        this.step2 = true;
      }
    }, error => {
      this.spinner.hide();
      this.toastr.error("Something went wrong.");
    });

}
  nextjoin() {
    if (this.username == "" && this.password == "") {
      return;
    }
    this.step1 = false;
    this.step2 = false;

  }
  onClickEye(){
    let element=document.getElementById('userPassword') as HTMLInputElement;
    if(element.type=="password")
    {
      
      element.type="text";

    }
    else{
      element.type="password";
    } 
  }

  signUp() {
    this.spinner.show();
    this.register = new SignUpRequest();
    this.register.email = this.email;
    this.register.username = this.username;
    this.register.password = this.password;
    this.register.type = this.type;
    this.register.linkedin = this.isLinkedIn;
    this.register.google = this.isGoogle;
    this.register.stepWizard =false;
    debugger;
    this.service.signUp(this.register).subscribe(res => {
      this.spinner.hide();
      if (res as string == "Register Successfully") {
        this.toastr.success(res+".");
        this.loginAuth(this.register.email,this.register.password);
        //this.router.navigate(['/login']);

      } else {
        this.toastr.error(res+".");
      }
    },error=>{
      this.spinner.hide();
      debugger;
    })
  }
  loginAuth(email,password){
    this.spinner.show();
    this.authenticationService.login(email,password)
      .subscribe
      (result => {
        this.spinner.hide();
        if (result !== "Invalid credientials") {
          debugger;
            this.toastr.success("login successfully");
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
            //location.reload();

        }
        else {
          this.toastr.error(result+".");
        }

      }, error => {
        this.spinner.hide();
        this.toastr.error("Something went wrong.");
      });

  }
  


  ngOnInit(): void {
   
  }
  ngAfterViewInit(){
    this.googleInitialize();
  }

  linkedIn() {
    let s = "https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=773k9ykh33794q&redirect_uri=http://localhost:4200&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social"
    window.location.href = s;
  }

  @ViewChild('loginRef', { static: true }) loginElement: ElementRef;
  auth2: any;
  Name: any;
  googleInitialize() {
    window['googleSDKLoaded'] = () => {
      window['gapi'].load('auth2', () => {
        this.auth2 = window['gapi'].auth2.init({
          client_id: '631867203803-gfnbuj33563dmuorhmfm6cv2prqasulq.apps.googleusercontent.com',
          cookie_policy: 'single_host_origin',
          scope: 'profile email'
        });
        //this.prepareLogin();
      });
    }
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) { return; }
      js = d.createElement(s); js.id = id;
      js.src = "https://apis.google.com/js/platform.js?onload=googleSDKLoaded";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'google-jssdk'));
  }

  prepareLogin() {
    this.auth2.attachClickHandler(this.loginElement.nativeElement, {},
      (googleUser) => {
        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        //this.show = true;
        this.Name = profile.getName();
        console.log('Image URL: ' + profile.getImageUrl());
        this.email=profile.getEmail();
     //  this.join();
       this.isGoogle=true;
   
        console.log('Email: ' + profile.getEmail());
        
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
