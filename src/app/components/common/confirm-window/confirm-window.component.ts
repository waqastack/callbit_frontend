import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { HiringWorkerService } from 'src/app/services/hiring-worker.service';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-confirm-window',
  templateUrl: './confirm-window.component.html',
  styleUrls: ['./confirm-window.component.scss']
})
export class ConfirmWindowComponent implements OnInit {
  modalRef: BsModalRef;
  message: string;
  id: any;
  public onClose: Subject<boolean>;
  constructor(private modalService: BsModalService, private bsModalRef: BsModalRef, private route: Router, private toastr: ToastrService,
    private spinner: NgxSpinnerService, private hiringWorkerService: HiringWorkerService) { }
  ngOnInit(): void {
    this.id = this.id;
    this.onClose = new Subject();
  }

  confirm(): void {
    this.hiringWorkerService.deleteCompaignInfo(this.id).subscribe(
      (res) => {
        this.spinner.hide();
        this.onClose.next(true);
        this.bsModalRef.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
    this.modalRef.hide();
  }

  decline(): void {
    this.message = 'Declined!';
    this.bsModalRef.hide();
  }
}
