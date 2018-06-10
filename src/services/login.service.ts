import {Injectable} from '@angular/core';
import {Response, Headers, Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {Account} from '../models/account';
import {AccountEventsService} from '../services/account.events.service';
import {SecurityToken} from '../models/securityToken';
import {Authority} from '../models/authority';
import {Observable} from 'rxjs/Observable';
import * as AppUtils from '../app/utils/app.utils';
import {Router} from '@angular/router';

@Injectable()
export class LoginService {
  constructor(private http: Http, private accountEventService: AccountEventsService, private router: Router) {
  }
  authenticate(username: string, password: string): Observable<Account> {

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    return this.http.post(AppUtils.BACKEND_API_ROOT_URL + AppUtils.BACKEND_API_AUTHENTICATE_PATH, JSON.stringify({login: username, password: password}), {headers: headers})
      .catch((error: any) => {
        if (error.status === 401) {
          return Observable.throw('Unauthorized');
        }
        // do any other checking for statuses here
      })
      .map((res: Response) => {
        const securityToken: SecurityToken = new SecurityToken(
          {
            publicSecret: res.headers.get(AppUtils.HEADER_X_SECRET),
            securityLevel: res.headers.get(AppUtils.HEADER_WWW_AUTHENTICATE)
          }
        );

        localStorage.setItem(AppUtils.CSRF_CLAIM_HEADER, res.headers.get(AppUtils.CSRF_CLAIM_HEADER));
        localStorage.setItem(AppUtils.STORAGE_ACCOUNT_TOKEN, res.text());
        localStorage.setItem(AppUtils.STORAGE_SECURITY_TOKEN, JSON.stringify(securityToken));

        const account: Account = new Account(res.json());
        account.authenticated = true;
        this.sendLoginSuccess(account);

        return account;
      })

      ;
  }

  sendLoginSuccess(account?: Account): void {
    if (!account) {
      account = new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN)));
    }
    this.accountEventService.loginSuccess(account);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN);
  }

  removeAccount(): void {
    localStorage.removeItem(AppUtils.STORAGE_ACCOUNT_TOKEN);
    localStorage.removeItem(AppUtils.STORAGE_SECURITY_TOKEN);
    localStorage.removeItem(AppUtils.CSRF_CLAIM_HEADER);
  }

  logout(callServer: boolean = true): void {
    console.log('Logging out');

    if (callServer) {
      this.http.get(AppUtils.BACKEND_API_ROOT_URL + '/logout').subscribe(() => {
        this.accountEventService.logout(new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN))));
        this.removeAccount();
        this.router.navigate(['/about']);
      });
    } else {
      this.removeAccount();
      this.router.navigate(['/about']);
    }
  }

  isAuthorized(roles: Array<string>): boolean {

    let authorized = false;
    const authorities: Array<string> = [];

    if (this.isAuthenticated() && roles) {
      const account: Account = new Account(JSON.parse(localStorage.getItem(AppUtils.STORAGE_ACCOUNT_TOKEN)));
      if (account && account.authorities) {

        for (let i = 0; i < account.authorities.length; i++) {
          const obj: Authority = account.authorities[i];
          authorities.push(obj.authority);
        }

        account.authoritiesStringArray = authorities;
        roles.forEach((role: string) => {

          if (authorities.indexOf(role) !== -1) {
            authorized = true;
          }
        });
      }
    }
    return authorized;
  }
}

