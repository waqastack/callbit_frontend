import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { CompaignService } from 'src/app/services/compaign.service';
import { CompaignResponse, CompaignEditableShow, CompaignEditRequest} from 'src/app/models/Compaign';
@Component({
  selector: 'app-edit-compaign',
  templateUrl: './edit-compaign.component.html',
  styleUrls: ['./edit-compaign.component.scss']
})
export class EditCompaignComponent implements OnInit {
  compaignID: any;
  _compaign: CompaignResponse;
  skillsKeyword: string[];
  compaign: CompaignEditRequest;
  compaignEditable: CompaignEditableShow;
  compaignResponse: CompaignResponse;
  keywordTags = [];
  showSuggestion: boolean = false;
  type: string[] = [];
  constructor(private service: CompaignService,public bsModalRef: BsModalRef, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private hiringWorkerService: HiringWorkerService) {
    this.compaignResponse = new CompaignResponse;
    this.compaign = new CompaignEditRequest();
    this.compaignEditable = new CompaignEditableShow();
  }

  ngOnInit(): void {
    this.compaignID = this.compaignID;
    this.GetSingleCompaign(this.compaignID);
  }
  GetSingleCompaign(id) {
    this.spinner.show();
    this.service.getSingleCompaign(id).subscribe(
      (res) => {
        this.spinner.hide();
        debugger
        this._compaign = res as CompaignResponse;
        this.compaignResponse = this._compaign[0];
        if (this.compaignResponse.type == '') {
          this.type = [];
        }
        if (this.compaignResponse.title == null) {
          this.compaignResponse.title = this.compaignResponse.name;
        }
        this.skillsKeyword = this.compaignResponse.type.split(',');
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  updateCompaignInfo(obj: string) {
    debugger
    this.compaign.id = this.compaignResponse.id;
    if (obj == 'Budget') {
      this.compaign.description = this.compaignResponse.description;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaign.type = this.compaignResponse.type;
      this.compaignEditable.sale = false;
      this.compaignEditable.price = false;
      this.compaignEditable.payByText = false;
      this.compaignEditable.payPerText = false;
    }
    if (obj == 'desc') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.totalAmount = this.compaignResponse.totalAmount;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaign.type = this.compaignResponse.type;
      this.compaignEditable.desc = false;
    }
    if (obj == 'title') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaign.totalAmount = this.compaignResponse.totalAmount;
      this.compaign.type = this.compaignResponse.type;
      this.compaignEditable.title = false;
    }
    if (obj == 'compaignDuration') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.type = this.compaignResponse.type;
      this.compaign.totalAmount = this.compaignResponse.totalAmount;
      this.compaignEditable.compaignDuration = false;
    }
    if (obj == 'TypeKeyword') {
      this.compaign.payByText = this.compaignResponse.payByText;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.description = this.compaignResponse.description;
      this.compaign.title = this.compaignResponse.title;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
      this.compaign.totalAmount = this.compaignResponse.totalAmount;
      this.compaignEditable.typeKeyword = false;
      this.compaign.type = this.type.join(',');
    }
    this.hiringWorkerService.updateCompaignInfo(this.compaign).subscribe(
      (res) => {
        this.spinner.hide();
        this.toastr.success('Updated Successfully');
        this.GetSingleCompaign(this.compaign.id);
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  cancelUpdate(obj: string) {
    if (obj == 'Budget') {
      this.compaignEditable.sale = false;
      this.compaignEditable.price = false;
      this.compaignEditable.payPerText = false;
      this.compaignEditable.payByText = false;
    }
    if (obj == 'desc') {
      this.compaignEditable.desc = false;
    }

    if (obj == 'title') {
      this.compaignEditable.title = false;
    }
    if (obj == 'compaignDuration') {
      this.compaignEditable.compaignDuration = false;
    }
    if (obj == 'TypeKeyword') {
      this.compaignEditable.typeKeyword = false;
    }
  }
  editable(obj: string) {
    if (obj == 'Budget') {
      this.compaignEditable.sale = true;
      this.compaignEditable.price = true;
      this.compaignEditable.payByText = true;
      this.compaignEditable.payPerText = true;
      this.compaign.sale = this.compaignResponse.sale;
      this.compaign.price = this.compaignResponse.price;
      this.compaign.payPerText = this.compaignResponse.payPerText;
      this.compaign.payByText = this.compaignResponse.payByText;
    }
    if (obj == 'desc') {
      this.compaignEditable.desc = true;
      this.compaign.description = this.compaignResponse.description;
    }

    if (obj == 'title') {
      this.compaignEditable.title = true;
      this.compaign.title = this.compaignResponse.title;
    }

    if (obj == 'TypeKeyword') {
      this.compaignEditable.typeKeyword = true;
      if (this.compaignResponse.type == '') {
        this.type = [];
      }
      else {
        let p = this.compaignResponse.type.split(',');
        debugger
        this.type = p;
      }
      this.compaign.type = '';
    }

    if (obj == 'compaignDuration') {
      this.compaignEditable.compaignDuration = true;
      this.compaign.compaignDuration = this.compaignResponse.compaignDuration;
    }
  }
  splitCompaignType(theString: string) {
    if (theString != null) return theString.split(',');
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
  addType(type, para) {
    if (!type) return;
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
    this.type = this.type.filter(x => x != i);
  }
  onAmountChange(amount: number, value: string) {
    if (value === 'sale') {
      var price: number = +this.compaign.price;
      this.compaign.totalAmount = price * amount;
      var x: number = +amount;
      this.compaign.sale = x;
    } else {
      this.compaign.totalAmount = this.compaign.sale * amount;
      this.compaign.price = amount.toString();
    }
  }
  changePayByType() {
    if (this.compaign.payByText == 'Pay By the Sales') {
      this.compaign.compaignDuration = 'Less than 7 days';
      this.compaign.payByText = 'Pay By the Sales';
      this.compaign.payPerText = 'Pay Per Transfer';
      this.compaign.payType = 'Part-Time';
    }
    if (this.compaign.payByText == 'Pay By the Fix Price') {
      this.compaign.payByText = 'Pay By the Fix Price';
      this.compaign.payPerText = 'Pay Per Hour';
      this.compaign.payType = 'One-Time';
      this.compaign.compaignDuration = '';
    }
  }
}
