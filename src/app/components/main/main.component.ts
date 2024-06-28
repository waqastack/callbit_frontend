import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead/typeahead-match.class';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CompaignResponse } from 'src/app/models/Compaign';
import { CompaignService } from 'src/app/services/compaign.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
declare var $;
import * as $ from 'jquery';
import { isNullOrUndefined } from 'util';
import * as AOS from 'aos';
import { AotSummaryResolver } from '@angular/compiler';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  selectedValue: string="";
  selectedOption: any;
  compaign: CompaignResponse[] = [];
  _compaign: CompaignResponse;
  selectedID: number;
  skillsKeyword: string[];
  skillsFlag: boolean = true;
  userType: number;
  userID: number;
  currentUser: any;
  noResult = false;
  selectedName: any;
  showSuggestion: boolean = false;
  showTextSuggestion: boolean = false;
  public popularKeywordLst: popularKeywordLst[] = [
    { id: 0, popularKeyword:'Cardio', backColor: 'orangered' },
    { id: 1, popularKeyword:'Medicare', backColor: 'orangered' },
    { id: 2, popularKeyword:'Final Expense', backColor: 'orangered' },
    { id: 3, popularKeyword:'Solar', backColor: 'orangered' }
  ];
  public selectedpopularKeywordLst: selectedpopularKeywordLst[] = [];
  public popularCompaignTrendLst: Array<Object> = [
    { id: 1, imgSrc: '/assets/images/popular-campaigns-1.png', popularCompaign: 'Cardio' },
    { id: 2, imgSrc: '/assets/images/popular-campaigns-2.png', popularCompaign: 'DME' },
    { id: 3, imgSrc: '/assets/images/popular-campaigns-3.png', popularCompaign: 'Medicare CPL\CPA' },
    { id: 4, imgSrc: '/assets/images/popular-campaigns-4.png', popularCompaign: 'Final Expense' },
    { id: 5, imgSrc: '/assets/images/popular-campaigns-4.png', popularCompaign: 'Auto Insurance LG/LT' },
  ];
  constructor(private service: CompaignService,
    private spinner: NgxSpinnerService,
    private route: Router,
    private authenticationService: AuthenticationService, private toastr: ToastrService) {
    this.compaign = [];
    this._compaign = new CompaignResponse();
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser) {
      this.userType = this.currentUser.type;
      this.userID = this.currentUser.id
    }
    this.selectedName = null;
    this.selectedpopularKeywordLst = [];
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1 
      },
      400: {
        items: 2
      },
      760: {
        items: 3
      },
      1000: {
        items: 4
      }
    },
    nav: true
  }

  ngOnInit(): void {
    //this.GetAllCompaign();
    AOS.init();
  }
  // GetAllCompaign() {
  //   this.service.getAllCompaign().subscribe(
  //     (res) => {
  //       this.compaign = res as CompaignResponse[];
  //       this.showSuggestion = true;
  //     },
  //     (error) => {
  //       this.spinner.hide();
  //     }
  //   );
  // }
 
  
  DetailCompaign(id) {
    if (id) {
      this._compaign = this.compaign.find((x) => x.id == id);
      if (this._compaign) {
        this.selectedID = this._compaign.id;
        this.skillsKeyword = this._compaign.type.split(',');
        if (this.skillsKeyword[0] == '') {
          this.skillsFlag = false;
        } else {
          this.skillsFlag = true;
        }
        localStorage.setItem('compaignSearchable', JSON.stringify(this.skillsKeyword));
        this.route.navigate(['/CompiagnsList']); // navigate to other page
      }
    }
  }
  splitCompaignType(theString: string) {
    if (theString != null) return theString.split(',');
  }
  popularfncValueGet(item) {
    this.selectedValue = "";
    this.selectedValue = item.popularKeyword;
    var length = [];
    length.push(this.selectedValue.toString());
    localStorage.setItem('compaignSearchable', JSON.stringify(length));
    this.route.navigate(['/CompiagnsList']); 
  }
  searchCompaign() {
    if (isNullOrUndefined(this.selectedValue) || this.selectedValue=='') {
      this.toastr.error("Search Compaign Field Is Empty");
      return;
    }
    if (this.noResult) {
      this.selectedValue = undefined;
      this.toastr.error("No Record Found");
      return;
    }
    else {
      this.authenticationService.destroyCompaignSearch();
      this.route.navigate(['/CompiagnsList']);
    }
  }
  onSelect(id:number): void {
    this.DetailCompaign(id);
  }
  openRelatedCompaign(value:string) {
    localStorage.setItem('compaignSearchable', JSON.stringify(value));
    this.route.navigate(['/CompiagnsList']); // navigate to other page
  }
  typeaheadNoResults(event: boolean): void {
    this.noResult = event;
  }
loadCampaigns(event: any) {
    debugger
    this.selectedValue = event.target.value;
    if (!this.selectedValue) {
      this.showSuggestion = false;
      this.showTextSuggestion = false;
    }
    else {
      this.service.SearchCampaignOnChange(this.selectedValue).subscribe(
        (res) => {
          this.spinner.hide();
          this.showTextSuggestion = true;
          this.compaign = res as [];
          if (this.compaign.length > 0) {
            this.showSuggestion = true;
          }
          else {
            this.showSuggestion = false;
          }
        },
        (error) => {
          this.spinner.hide();
        }
      );
    }
  }
}
 export interface popularKeywordLst {
  id: number;
  popularKeyword: string;
  backColor: string;
}
export interface selectedpopularKeywordLst {
  id: number;
  popularKeyword: string;
  backColor: string;
}
