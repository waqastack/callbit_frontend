import { HttpClient, HttpEventType } from '@angular/common/http';
import {
  Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild, AfterViewInit, OnDestroy,ChangeDetectorRef
 } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { PortfolioInfo, ProfileInfo } from 'src/app/models/profileInfo';
import { ProfileService } from 'src/app/services/ProfileService.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { NgForm } from "@angular/forms"
import { AngularStripeService } from '@fireflysemantics/angular-stripe-service'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  _profileInfo: ProfileInfo;
  _portfolioInfo: PortfolioInfo;
  _portfolioInfoo: PortfolioInfo[] = [];
  clock: string = '';
  clockHandle;
  profilePicture: string = '../../../assets/images/avatar.jpg';
  portFolioPicArray: File[] = [];
  id: number;
  userID: string;
  userType: string;
  imgsrc = '../../../assets/images/avatar.jpg';
  portFoliosrc = '../../../assets/images/avatar.jpg';
  isCompaingnType: boolean = false;
  profilePicUrl: string = '';
  nameTitle: string = 'Your Name';
  isNameTitle: boolean = false;
  compaignTitle: string = 'Web & Graphic Designer';
  isTitle: boolean = false;
  description: string = 'Deliver great work. Get notified when you get an order and use our system to discuss details with customers.';
  isDescription: boolean = false;
  isSittingCapacity: boolean = false;
  isCancelBtn: boolean = false;
  isRemoveCompaign: boolean = false;
  typeArray: string[] = [];
  compaignType: string = "";
  isCompaignType: boolean = false;
  @ViewChild('cardInfo', { static: false }) cardInfo: ElementRef;

  stripe;
  loading = false;
  confirmation;

  card: any;
  cardHandler = this.onChange.bind(this);
  error: string;

  constructor(private el: ElementRef, private _profileService: ProfileService,
    private toastr: ToastrService, private spinner: NgxSpinnerService,
    private route: Router, public _d: DomSanitizer, public sanitizaer: DomSanitizer, private cd: ChangeDetectorRef,
    private stripeService: AngularStripeService) {
    this._profileInfo = new ProfileInfo();
    this._portfolioInfo = new PortfolioInfo();
  }
  ngOnInit(): void {
    this.userID = localStorage.getItem('currentUserNo');
    this.userType=localStorage.getItem('userType');
    this.GetProfilePicture();
    this.GetProfileInfo();
    this.clockHandle = setInterval(() => {
      this.clock = new Date().toLocaleTimeString();
    }, 1000);
    this._profileService.profilePic
    .asObservable()
    .subscribe({ next: (source) => (this.profilePicUrl = source) });
  }
  ngAfterViewInit() {
    this.stripeService.setPublishableKey('pk_test_51IzHKXIDrCXc6Uk6VeuYcQpquygN7QaUtavNVK0zBMyKS17DnP5z6PlxGX7ZvrrvPEN3w47hk3D5TE3EUE0fOJVd00tHR6pvkD').then(
      stripe => {
        this.stripe = stripe;
        const elements = stripe.elements();
        this.card = elements.create('card');
        this.card.mount(this.cardInfo.nativeElement);
        this.card.addEventListener('change', this.cardHandler);
      });
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    this.DistroyBolean();
  }
  @ViewChild('PF') _PF: any;
  _isPortFolioSelected: boolean = false;
  _portFolioSelectedID: string = '';
  PortFolioSelected(id) {
    if (id) {
      this._portFolioSelectedID = id;
      this._isPortFolioSelected = true;
    }
  }

  ngOnDestroy() {
    this.card.removeEventListener('change', this.cardHandler);
    this.card.destroy();
  }
  GetProfilePicture() {
    this.spinner.show();
    this.id = +this.userID;
    this._profileService.GetProfilePicture(this.id).subscribe(res => {
      this.spinner.hide();
      if (res) {
        this.imgsrc = res;
      }
    }, error => {
      this.spinner.hide();
    });
  }
  GetProfileInfo() {
    this.spinner.show();
    this.id = +this.userID;
    this._profileService.GetProfileInfo(this.id).subscribe(res => {
      this.spinner.hide();
      if (res) {
        this._profileInfo = res[0];
        if(this._profileInfo.pCompaign==""){
          this.isCompaingnType=false;
        }else{
          this.isCompaingnType=true;
        }    
        this.GetPortfolioInfo(this._profileInfo.profileID);
      }
    }, error => {
      this.spinner.hide();

    });
  }
  GetPortfolioInfo(id) {
    this.spinner.show();
    this.id = +this.userID;
    this._profileService.GetPortfolioInfo(id).subscribe(res => {
      this.spinner.hide();
      if (res.length != 0) {
        this._portfolioInfoo = [];
        for (var item of res) {
          item.portFolioPath =  item.portFolioPath;
          this._portfolioInfoo.push(item);
        }
      }
    }, error => {
      this.spinner.hide();

    });
  }
  handleFileInput(files) {
    this.DistroyBolean();
    if (files.length === 0) {
      return;
    }
    debugger
    const file = (files.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file)

  }
  _handleReaderLoaded(e) {
    let reader = e.target;
    this.imgsrc = reader.result;
    this.spinner.show();
    this._profileService.UploadProfilePicture({ fileName: this.imgsrc, usrID: this.userID }).subscribe(res => {
      this.toastr.success("Uploaded Successfully");
      this.spinner.hide();
    }, error => {
      this.spinner.hide();

    });
  }
  sendFiles(files) {
    debugger
    if (files.length === 0) {
      return;
    }
    const file = (files.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded1.bind(this);
    reader.readAsDataURL(file)
    
  }
  _handleReaderLoaded1(e) {
    let reader = e.target;
    this.portFoliosrc = reader.result;
    let proID = this._profileInfo.profileID.toString();
    this.spinner.show();
    this._profileService.UploadFiles({ fileName: this.portFoliosrc, usrID: this.userID, ProfileID: proID }).
      subscribe(res => {
        this.GetPortfolioInfo(this._profileInfo.profileID);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();

      });
  }

  EditNameInfo(data) {
    this.isNameTitle = true;
    if (data == 'update') {
      this.isNameTitle = false;
    }
  }
  EditProfileData(event) {
    this.isCancelBtn=true;
    if (event == 'title') {
      this.isTitle = true;
      this.isDescription = false;
      this.isNameTitle = false;
      this.isCompaignType = false;
      this.isSittingCapacity = false;
    } else if (event == 'description') {
      this.isTitle = false;
      this.isDescription = true;
      this.isNameTitle = false;
      this.isCompaignType = false;
      this.isSittingCapacity = false;
    } else if (event == 'nameInfo') {
      this.isTitle = false;
      this.isDescription = false;
      this.isNameTitle = true;
      this.isCompaignType = false;
      this.isSittingCapacity = false;
    } else if (event == 'compaignType') {
      this.isTitle = false;
      this.isDescription = false;
      this.isNameTitle = false;
      this.isCompaignType = true;
      this.isSittingCapacity = false;
    } else {
      this.isTitle = false;
      this.isDescription = false;
      this.isNameTitle = false;
      this.isCompaignType = false;
      this.isSittingCapacity = true;
    }
  }

  AddCompaignType(type) {
    if (type == "") {
      return;
    }
    if (this._profileInfo.pCompaign) {
      this.typeArray = this._profileInfo.pCompaign.split(',');
    }
    this.typeArray.push(type);
    this._profileInfo.pCompaign = this.typeArray.toString();
    if(this.typeArray.length>0){
      this.isCompaingnType=false;
    }
    else{
      this.isCompaingnType=true;      
    }
    this.compaignType = "";
  }

  removeItem(i: number): void {
    debugger
    let aa=this._profileInfo.pCompaign.split(',');
    aa.splice(i, 1);
    this._profileInfo.pCompaign=aa.toString();
    this.isRemoveCompaign=true;
  }
  UpdateAllProfileInformation() {
    this.DistroyBolean();
    //this.spinner.show();
    this._profileService.ProfileInfo(this._profileInfo).subscribe(res => {
      this.spinner.hide();
      if (res != 'Something went wrong') {
      }
    }, error => {
      this.spinner.hide();
    });
  }
  RemoveProfileInformation() {
    this.DistroyBolean();
    this.spinner.show();
    this._profileService.RemovePortfolioInfo(this._portFolioSelectedID, this._profileInfo.profileID).subscribe(res => {
      this.spinner.hide();
      if (res) {
        this._isPortFolioSelected = true;
        //this.toastr.success('Deleted successfully', 'Success');
        this.GetPortfolioInfo(this._profileInfo.profileID);
      }
    }, error => {
      this.spinner.hide();
    });
  }
  DistroyBolean() {
    this.isCancelBtn=false;
    this.isTitle = false;
    this.isDescription = false;
    this.isNameTitle = false;
    this.isCompaignType = false;
    this.isSittingCapacity = false;
    this.isRemoveCompaign=false;
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  onChange({ error }) {
    if (error) {
      this.error = error.message;
    } else {
      this.error = null;
    }
    this.cd.detectChanges();
  }
  async onSubmit(form: NgForm) {
    debugger
    this.spinner.show();
    const { token, error } = await this.stripe.createToken(this.card);
    if (error) {
      this.toastr.error("Some error occured");
    }
    else
    {
      this.id = +this.userID;
      this._profileService.SaveCardInfo({
        customer_stripe_id: '', card_id: token.card.id,
        token_id: token.id, userid: this.id, type: this.userType
      }).subscribe(res => {
        this.toastr.success(res);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();

      });

    }
  }
}
