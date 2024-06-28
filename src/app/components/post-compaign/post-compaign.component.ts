import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CompaignRequest, CompaignType } from 'src/app/models/Compaign';
import { CompaignService } from 'src/app/services/compaign.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
//import { AnyTxtRecord } from 'dns';

@Component({
  selector: 'app-post-compaign',
  templateUrl: './post-compaign.component.html',
  styleUrls: ['./post-compaign.component.css'],
})
export class PostCompaignComponent implements OnInit {
  NameMaxLength = 100;
  NameMinLength = 10;
  DescriptionMaxLength = 1000;
  DescriptionMinLength = 50;
  DescribeMaxLength = 100; //Describe property of CompaignRequest
  DescribeMinLength = 10;
  MaxQuestionsAllowed = 5;
  MinQuestionLength = 10;
  MaxQuestionLength = 100;
  compaign: CompaignRequest;
  f1: boolean = true;
  f2: boolean = false;
  f3: boolean = false;
  f4: boolean = false;
  type: string[] = [];
  salesDisabled: boolean = false;
  priceDisabled: boolean = false;
  ImageBaseData: string | ArrayBuffer = null;
  keywordTags = [];
  showSuggestion: boolean = false;
  checkQst: boolean = false;
  qstExtra: string = "Do you have your own DDV?";
  enableEdit = false;
  enableEditIndex = null;
  editor = ClassicEditor;
  constructor(
    private service: CompaignService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ) {
    this.compaign = new CompaignRequest();
    this.compaign.setOwnPriceRbtn = false;
    this.compaign.payPrice = 0;
    this.compaign.paySale = 0;

    // this.firstForm=this.fb.group({
    //   title:this.fb.control('',[Validators.required, Validators.maxLength(100)]),
    //   description:this.fb.control('',[Validators.required, Validators.maxLength(500)])
    // })
  }

  ngOnInit(): void {
    
  }

  formCurrentLevel: number = 0;
  goBack() {
    this.formCurrentLevel--;
  }
  //#region FIRST FORM
  campaignNameError: string = '';
  onCampaignNameChange() {
    this.campaignNameError = '';
  }
  
  onFirstFormSubmit() {
    if (!this.compaign.name) {
      this.toastr.error("Enter a Campaign");
    }
    // if (!this.compaign.inBound && !this.compaign.outBound) {
    //   this.toastr.error("Please select atleast one checkbox");
    //   return;
    // }
    else {
    this.f1 = false;
    this.f2 = true;
    this.formCurrentLevel++;
    }
  }
  //#endregion
  //#region DESCRIPTION FORM
  campaignDescriptionError: string = '';
  question: string = '';
  qstion: string = '';
  questionsError: string = '';
  saveIndexNo : number=0;
  addNewQuestion() {
    if (this.question) {
      if (this.compaign.questions.length > 5) {
        this.question = '';
        this.toastr.error("Questions limit to add is 5");
      }
      else {
        this.questionsError = '';
        debugger
        const questions = this.compaign.questions;
        if (!this.question) {
          return;
        }
        if (questions.length >= this.MaxQuestionsAllowed) {
          this.questionsError = `You have reached your limit of ${this.MaxQuestionsAllowed} questions.`;
          return;
        }
        if (this.question == this.qstExtra) {
          this.questionsError = `Your entered question already exist Or Please select checkbox to add`;
          return;
        }
        if (
          this.question.length < this.MinQuestionLength ||
          this.question.length > this.MaxQuestionLength
        ) {
          this.questionsError = `Question must be less than  but less than ${this.MinQuestionLength} characters.`;
          return;
        }
        if (this.type) {
          this.compaign.questions.push(this.question);
        }
        this.question = '';
      }
    }
    else {
      this.toastr.error("Empty Question cannot be added");
    }
  }
  changeQstAdd(event: any) {
    debugger
    if (event) {
      this.compaign.questions.push(this.qstExtra);
    }
    else {
      this.compaign.questions = this.compaign.questions.filter(x => x != this.qstExtra);
    }
  }
  enableEditMethod(e, i) {
    this.enableEdit = true;
    this.enableEditIndex = i;
    this.saveIndexNo = i;
    this.qstion = this.compaign.questions[this.saveIndexNo];
  }
  saveSegment() {
    debugger
    this.compaign.questions[this.saveIndexNo] = this.qstion;
    this.enableEdit = false;
    this.enableEditIndex = null;
  }
  cancel() {
    this.enableEdit = false;
  }
  deleteQst(i) {
    this.compaign.questions = this.compaign.questions.filter(x => x != this.compaign.questions[i]);
  }
  onCampaignDescriptionChange() {
    this.campaignDescriptionError = '';
  }
  onDescriptionFormSubmit() {
    const value = this.compaign.description;
    console.log(name);
    if (
      !value ||
      value.length == 0 ||
      value.length > this.DescriptionMaxLength ||
      value.length < this.DescriptionMinLength
    ) {
      this.toastr.error(`Description is required and must be less than ${this.DescriptionMaxLength} but greater than ${this.DescriptionMinLength} characters.`);
      this.campaignDescriptionError = `Description is required and must be less than ${this.DescriptionMaxLength} but greater than ${this.DescriptionMinLength} characters.`;
      return;
    }
    this.formCurrentLevel++;
  }
  //#endregion
  stepMove(value) {
    if (value == 0) {
      this.formCurrentLevel = 0;
    }
    if (value == 1) {
      if (!this.compaign.name || this.compaign.name.length == 0 || this.compaign.name.length > this.NameMaxLength
        || this.compaign.name.length < this.NameMinLength) {
        this.formCurrentLevel = 0;
      }
      else {
        this.formCurrentLevel = 1;
      }
    }
    if (value == 2) {
      if (!this.compaign.name || this.compaign.name.length == 0 || this.compaign.name.length > this.NameMaxLength
        || this.compaign.name.length < this.NameMinLength) {
        this.formCurrentLevel = 0;
      }
      else if (!this.compaign.description || this.compaign.description.length == 0 ||
        this.compaign.description.length > this.DescriptionMaxLength || value.length < this.DescriptionMinLength) {
        this.formCurrentLevel = 1;
      }
      else {
        this.formCurrentLevel = 2;
      }
    }
    if (value == 3) {
      if (!this.compaign.name || this.compaign.name.length == 0 || this.compaign.name.length > this.NameMaxLength
        || this.compaign.name.length < this.NameMinLength) {
        this.formCurrentLevel = 0;
      }
      else if (!this.compaign.description || this.compaign.description.length == 0 ||
        this.compaign.description.length > this.DescriptionMaxLength || value.length < this.DescriptionMinLength) {
        this.formCurrentLevel = 1;
      }
      else {
        this.formCurrentLevel = 3;
      }
    }
  }
  //#region BUDGET
  fixPriceError: string = '';
  fixPriceDescriptionError: string = '';
  onFixPriceChange() {
    this.fixPriceError = '';
  }
  onFixPriceDescriptionChange() {
    this.fixPriceDescriptionError = '';
  }
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }
  onBudgetFormSubmit() {
    if (!this.compaign.price) {
      this.toastr.error('This field is required');
      this.fixPriceError = 'This field is required';
      return;
    }
    this.formCurrentLevel++;
  }
  //#endregion

  //#region CAMPAIGN TYPE
  addType(type, para) {
    if (!type) return;
    if (this.type.length > 4) { this.toastr.error("You can only add five tags"); return; }
    var rst = this.type.filter(x => x == type);
    if (rst.length > 0) {
      this.toastr.error("Already Added");
    }
    else {
      this.type.push(type);
      this.compaign.type = '';
      this.showSuggestion = false;
      if (para === '') {
        this.addKeyword(type);
      }
    }
  }
  //#endregion
  handleFileInput(files) {
    debugger
    let me = this;
    let file = files[0];
    this.compaign.FileNames = file.name;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      me.ImageBaseData = reader.result;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }
  downloadDocFile(data) {
    debugger
    this.compaign.uploadFile = this.ImageBaseData.toString();
    let filepdf = this.compaign.uploadFile;
    let a = document.createElement('a');
    a.href = filepdf;
    a.download = 'test';
    a.click();
  }
  uploadFile(file: File) {
    const formData = new FormData();

    formData.append('thumbnail', file);

    //const upload$ = this.http.post("/api/thumbnail-upload", formData);

    //upload$.subscribe();
  }
  postCompaign() {
    this.compaign.type = this.type.join(',');
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    this.compaign.userID = userRst.id;
    this.compaign.uploadFile = this.ImageBaseData == null ? '' : this.ImageBaseData.toString();
    this.compaign.price = this.compaign.price.toString();
    this.spinner.show();
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position: any) => {
    //     debugger
    //     if (position) {
    //       console.log("Latitude: " + position.coords.latitude +
    //         "Longitude: " + position.coords.longitude);
    //       this.compaign.latitude = (position.coords.latitude).toString();
    //       this.compaign.longitude = (position.coords.longitude).toString();
    //       this.compaign.location='';
    this.service.getLocation().subscribe((res:any)=>{
      debugger
      this.compaign.latitude='';
      this.compaign.longitude='';
      this.compaign.location=res.country;
               
      this.service.postCompaign(this.compaign).subscribe(
        (res) => {
          this.spinner.hide();
          this.toastr.success('Compaign Posted Successfully!');
          this.router.navigateByUrl('/my');
        },
        (error) => {
          this.spinner.hide();
        }
      );
    },(err=>alert(err)))
  

//   }
// },
//   (error: any) => console.log(error));
// } else {
// alert("Geolocation is not supported by this browser.");
// }
 }
  // checkedOwnPrice() {

  //   if (this.compaign.setOwnPriceRbtn) {
  //     this.salesDisabled = false;
  //     this.priceDisabled = false;
  //   }
  //   else {
  //     this.compaign.payPrice = 0;
  //     this.compaign.paySale = 0;
  //     this.compaign.totalAmount = 0;
  //     this.salesDisabled = true;
  //     this.priceDisabled = true;
  //   }
  // }
  onAmountChange(amount: number, value: string) {
    if (value === 'sale') {
      this.compaign.totalAmount = this.compaign.payPrice * amount;
      var x: number = +amount;
      this.compaign.paySale = x;
    } else {
      this.compaign.totalAmount = this.compaign.paySale * amount;
      var y: number = +amount;
      this.compaign.payPrice = y;
    }
  }
  changePayByType(value: number) {
    if (value == 1) {
      this.compaign.compaignDuration = 'Less than 7 days';
      this.compaign.payByText = 'Pay By the Sales';
      this.compaign.payPerText = 'Pay Per Transfer';
      this.compaign.payType = 'Part-Time';
    }
    if (value == 2) {
      this.compaign.payByText = 'Pay By the Fix Price';
      this.compaign.payPerText = 'Pay Per Hour';
      this.compaign.payType = 'One-Time';
      this.compaign.compaignDuration = '';
    }
  }
  changePerType(value: number, type: string) {
    if (type == 'Sales') {
      if (value == 1) {
        this.compaign.payPerText = 'Pay Per Transfer';
      }
      if (value == 2) {
        this.compaign.payPerText = 'Pay Per Lead';
      }
      if (value == 3) {
        this.compaign.payPerText = 'Pay Per Sale';
      }
      if (value == 4) {
        this.compaign.payPerText = 'Others';
      }
    } else {
      if (value == 1) {
        this.compaign.payPerText = 'Pay Per Hour';
      }
      if (value == 2) {
        this.compaign.payPerText = 'Pay Per Day';
      }
      if (value == 3) {
        this.compaign.payPerText = 'Pay Per Week';
      }
      if (value == 4) {
        this.compaign.payPerText = 'Pay Per Month';
      }
    }
  }
  changeCompaignDuration(value: number) {
    if (value == 1) {
      this.compaign.compaignDuration = 'Less than 7 days';
    }
    if (value == 2) {
      this.compaign.compaignDuration = 'Less than 1 months';
    }
    if (value == 3) {
      this.compaign.compaignDuration = 'Less than 3 months';
    }
    if (value == 4) {
      this.compaign.compaignDuration = '3 to 6 months';
    }
  }
  searchText() {
    this.service.SearchKeyword(this.compaign.type).subscribe(
      (res) => {
        this.spinner.hide();
        this.keywordTags = res as [];
        if (this.keywordTags.length > 0) {
          this.showSuggestion = true;
        }
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  addKeyword(type: any) {
    debugger
    this.service.addKeyword({ KeywordName: type }).subscribe(
      (res) => {
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  hideSuggestion() {
    this.showSuggestion = false;
  }
  deletetype(i) {
    this.type=this.type.filter(x => x != i);
  }
}
