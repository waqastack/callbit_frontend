import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private auth: AuthService) {}
  isLoading: boolean = true;
  isVerified: boolean = false;
  ngOnInit(): void {
    this.isLoading = true;

    const e = this.route.snapshot.queryParamMap.get('e');
    const d = this.route.snapshot.queryParamMap.get('d');
    this.auth
      .verifyEmail(e, d)
      .toPromise()
      .then((x) => {
        this.isVerified = true;
      })
      .catch((err) => {
        this.isVerified = false;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}
