import { Component, OnInit } from '@angular/core';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute, Router } from '@angular/router';
declare var $;
import * as $ from 'jquery';

@Component({
  selector: 'app-proposal-detail',
  templateUrl: './proposal-detail.component.html',
  styleUrls: ['./proposal-detail.component.scss']
})
export class ProposalDetailComponent implements OnInit {
  userID: number;
  private sub: any;
  param: number;
  proposalDetail: any;
  constructor(private toastr: ToastrService, private spinner: NgxSpinnerService,
    private hiringWorkerService: HiringWorkerService, private route: ActivatedRoute, private router: Router) {
    this.proposalDetail = null;
  }


  ngOnInit(): void {
    var userRst = JSON.parse(localStorage.getItem('currentUser'));
    debugger
    this.userID = userRst.id;
    this.sub = this.route.params.subscribe(params => {
      this.param = +params['id'];
      this.UserProposals();
    });
  }
  UserProposals() {
    this.spinner.show();
    this.hiringWorkerService.UserProposals({ userID: this.userID, proposalID: this.param }).subscribe(
      (res) => {
        this.spinner.hide();
        this.proposalDetail = res;
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
