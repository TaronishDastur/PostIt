import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../shared/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private token = '';
  private tokenTimer: any;
  private userId: string;
  tokenUpdated = new BehaviorSubject<boolean>(false);
  private url = environment.serverUrl + '/users';

  constructor(private httpClient: HttpClient, private router: Router) {}

  addUser(email: string, password: string) {
    const user = new User(email, password);
    this.httpClient
      .post<{ message: string; user: User }>(this.url + '/signup', user)
      .subscribe((data) => {
        this.router.navigate(['/login']);
      });
  }

  //   retrievs the login data and token and saves token to local storage, and adds timer for expiry
  login(email: string, password: string) {
    const user = new User(email, password);
    this.httpClient
      .post<{
        message: string;
        token: string;
        expiresIn: number;
        userId: string;
      }>(this.url + '/login', user)
      .subscribe((data) => {
        this.token = data.token;
        this.userId = data.userId;
        this.tokenUpdated.next(true);
        this.router.navigate(['/']);
        this.saveTokenData(
          new Date(new Date().getTime() + data.expiresIn * 60 * 1000)
        );
        this.setTokenTimer(data.expiresIn * 60 * 1000);
      });
  }

  //   logout function => resets the token and token timer and clears the local storage
  logout() {
    this.token = null;
    this.userId = '';
    this.tokenUpdated.next(null);
    this.router.navigate(['/']);
    clearTimeout(this.tokenTimer);
    this.clearTokenData();
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }
  //   token obs which is updated when token is updated
  getTokenUpdates() {
    return this.tokenUpdated;
  }

  //   sets the timer which expires when the token expires (60 minutes)
  setTokenTimer(expiresIn) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn);
  }

  //   auth the user if the token is stored and valid
  // if valid then follow login steps and store token and timer
  authUserOnLoad() {
    if (this.hasTokenData()) {
      // get the time remaining => token expiry date - current time
      const expiry = new Date(localStorage.getItem('expires'));
      const now = new Date();
      const expiresIn = expiry.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.setTokenTimer(expiresIn);
        this.token = localStorage.getItem('token');
        this.tokenUpdated.next(true);
        this.userId = localStorage.getItem('userId');
      }
      return false;
    }
    return false;
  }

  private saveTokenData(expires) {
    localStorage.setItem('token', this.token);
    localStorage.setItem('expires', expires);
    localStorage.setItem('userId', this.userId);
  }

  private clearTokenData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expires');
    localStorage.removeItem('userId');
  }

  private hasTokenData() {
    if (
      !!localStorage.getItem('token') &&
      !!localStorage.getItem('expires') &&
      !!localStorage.getItem('userId')
    ) {
      return true;
    }
    return false;
  }
}
