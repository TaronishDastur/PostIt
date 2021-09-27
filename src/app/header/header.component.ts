import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthenticationService } from '../authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean;
  destroy$ = new Subject<boolean>();
  constructor(private authService: AuthenticationService) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  ngOnInit(): void {
    this.authService
      .getTokenUpdates()
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => (this.isLoggedIn = val));
  }

  onLogout() {
    this.authService.logout();
  }
}
