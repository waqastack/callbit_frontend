import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import {
  Compaign, SubmitProposalModel,
  CampaignQuestion,
  CampaignAnswer
} from 'src/app/models/Compaign';
import { CompaignService } from 'src/app/services/compaign.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-submit-proposal-no-auth',
  templateUrl: './submit-proposal-no-auth.component.html',
  styleUrls: ['./submit-proposal-no-auth.component.scss']
})
export class SubmitProposalNoAuthComponent implements OnInit {

  private sub: any;
  param: number;
  _compaign: Compaign[] = [];
  salesRate: number = 0;
  noOfSales: number = 0;
  resultTotal: number = 0;

  registerForm: FormGroup;
  submitted = false;
  selectedID: number;
  isSalesRate: boolean = false;
  isNoOfSales: boolean = false;
  areQuestionsAnswered: boolean = true; // keep it true initially to hide error message in the start

  isCoverLetterText: boolean = false;

  _submitProposalModel: SubmitProposalModel;

  constructor(private service: CompaignService, private formBuilder: FormBuilder, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private route: ActivatedRoute, private router: Router) {

    //this._compaign = new Compaign();
    this._submitProposalModel = new SubmitProposalModel();
  }
  ngOnInit(): void {
    // Get Query parameter
    let userID = localStorage.getItem('currentUserNo');
    this._submitProposalModel.UserID = +userID;
    this.sub = this.route.params.subscribe(params => {
      this.param = +params['id'];
      this.GetSingleCompaign(this.param);
    });
    this.FormGroup();
  }
  FormGroup() {
    this.registerForm = this.formBuilder.group({
      numberofSales: ['', Validators.required],
      salesRate: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }
  GetSingleCompaign(id) {
    this.spinner.show();
    this.service.getSingleCompaign(id).subscribe(res => {
      this.spinner.hide();
      this._compaign = res as Compaign[];
      this._submitProposalModel.CompaignID = this._compaign[0].id;
      this._submitProposalModel.clientID = this._compaign[0].userid.toString();
      //console.log(this._compaign)
    }, error => {
      this.spinner.hide();

    });
  }
  CalculatePercentage() {
    if (this._submitProposalModel.numberofSales && this._submitProposalModel.salesRate) {

      var mulOfSales = this._submitProposalModel.numberofSales * this._submitProposalModel.salesRate;;

      var threePercent = (3 / 100) * mulOfSales;
      var result = mulOfSales - threePercent;
      this.resultTotal = Math.round(result);
      this._submitProposalModel.clientRecive = this.resultTotal;
    }
  }
  GetCoverLetterText() {

  }
  // onFileSelected(event) {
  //   const file: File = event.target.files[0];

  //   if (file) {
  //     this._submitProposalModel.uploadFile = file.name;
  //   }
  // }
  fileToUpload: File;
  uploadFile(files: FileList) {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = <File>files[0];

    this._submitProposalModel.uploadFile = this.fileToUpload.name;

  }
  private _getAnswers(answers: CampaignAnswer[]) {
    this._compaign[0].questions.forEach((x: any) => {
      let elem: any = document.getElementsByName('answer' + x.id)[0]; //.value;
      //console.log(elem.value);
      if (elem && elem.value.trim().length == 0) {
        this.areQuestionsAnswered = false;
      }
      let ans: CampaignAnswer = new CampaignAnswer();
      ans.Answer = elem.value;
      ans.QuestionId = x.id;
      answers.push(ans);
    });
  }
  SubmitProposal() {
    //this.submitted = true
    debugger
    let answers: CampaignAnswer[] = [];
    if (this._compaign[0].questions && this._compaign[0].questions.length > 0) {
      this.areQuestionsAnswered = true;
      this._getAnswers(answers);
    }
    this.isNoOfSales =
      this._submitProposalModel.numberofSales != undefined &&
        this._submitProposalModel.numberofSales != 0
        ? false
        : true;
    this.isSalesRate =
      this._submitProposalModel.salesRate != undefined &&
        this._submitProposalModel.salesRate != 0
        ? false
        : true;
    this.isCoverLetterText =
      this._submitProposalModel.coverLetter != undefined &&
        this._submitProposalModel.coverLetter != ''
        ? false
        : true;

    // stop here if form is invalid
    if (
      this.isSalesRate == true &&
      this.isNoOfSales == true &&
      this.isCoverLetterText == true &&
      !this.areQuestionsAnswered
    ) {
      //this.toastr.warning("Please fill required field");
      return;
    }

    let CID = this._submitProposalModel.CompaignID.toString();
    let UID = this._submitProposalModel.UserID.toString();
    let SR = this._submitProposalModel.salesRate.toString();
    let NS = this._submitProposalModel.numberofSales.toString();
    let CR = this._submitProposalModel.clientRecive.toString();
    let CI = this._submitProposalModel.clientID.toString();

    let formData = new FormData();
    formData.append('files', this.fileToUpload);
    formData.append('compaignID', CID);
    formData.append('userID', UID);
    formData.append('salesRate', SR);
    formData.append('numberofSales', NS);
    formData.append('clientRecive', CR);
    formData.append('coverLetter', this._submitProposalModel.coverLetter);
    formData.append('clientID', CI);
    answers.forEach((x) => {
      formData.append('Answers', JSON.stringify(x));
    });

    this.spinner.show();
    this.service.SubmitProposal(formData).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastr.success(JSON.stringify(res.res).toString());
        this.router.navigate(['/home']); // navigate to other page
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  CheckViladation(data) {
    if (data == 'NS') {
      if (this._submitProposalModel.numberofSales != undefined && this._submitProposalModel.numberofSales != 0 && this._submitProposalModel.numberofSales != null) {
        this.isNoOfSales = false;
      }
      else {
        this.isNoOfSales = true;
      }
    } else if (data == 'SR') {
      if (this._submitProposalModel.salesRate != undefined && this._submitProposalModel.salesRate != 0 && this._submitProposalModel.salesRate != null) {
        this.isSalesRate = false;
      }
      else {
        this.isSalesRate = true;
      }
    } else {
      if (this._submitProposalModel.coverLetter != undefined && this._submitProposalModel.coverLetter != '' && this._submitProposalModel.coverLetter != null) {
        this.isCoverLetterText = false;
      }
      else {
        this.isCoverLetterText = true;
      }
    }
  }
  onReset() {
    this.submitted = false;
    this.registerForm.reset();
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
  GetCompaignDetail() {
    debugger
    if (this._submitProposalModel.CompaignID) {
      this.router.navigate(['/submitproposal', this._submitProposalModel.CompaignID]); // navigate to other page
    }
  }

}
