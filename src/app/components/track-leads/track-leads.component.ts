import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { LeadSubList, LeadSubQstList
} from 'src/app/models/hiring-user';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { ToastrService } from 'ngx-toastr';
declare var $;
import * as $ from 'jquery';

@Component({
  selector: 'app-track-leads',
  templateUrl: './track-leads.component.html',
  styleUrls: ['./track-leads.component.scss']
})
export class TrackLeadsComponent implements OnInit {
  userID: number;
  leadSubList: LeadSubList[];
  leadSubQstList: LeadSubQstList[];
  trackID: string;
  rowsControls = [];
  type: string;
  constructor( private spinner: NgxSpinnerService,
    private route: ActivatedRoute, private router: Router, private hiringWorkerService: HiringWorkerService,
    private toastr: ToastrService) {
    this.userID = Number(localStorage.getItem('currentUserNo'));
    this.leadSubList = [];
    this.leadSubQstList = [];
    this.trackID = localStorage.getItem("trackID");
  }


  ngOnInit(): void {
    var abc = localStorage.getItem('type');
    if (abc == '1') {
      this.type = "Call Center";
    }
    else {
      this.type = "Client";
    }
    this.getSubmittedLeads();
  }
  getSubmittedLeads() {
    this.spinner.show();
    this.hiringWorkerService.getSubmittedLeads(this.userID, this.type).subscribe(res => {
      this.spinner.hide();
      this.leadSubList = res.obj1;
      this.leadSubQstList = res.obj2;
      
    }, error => {
      this.spinner.hide();

    });
  }
  collapsible() {
    debugger
    $('.hiddenRow').hide();
    $(this).next('tr').find('.hiddenRow').show();
  }
}
