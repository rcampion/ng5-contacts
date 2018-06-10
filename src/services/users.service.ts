import {Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import * as AppUtils from '../app/utils/app.utils';
import {Observable} from 'rxjs/Observable';
import {Account} from '../models/account';
import {Authority} from '../models/authority';

@Injectable()
export class UsersService {
  http: Http;
  constructor(http: Http) {
    this.http = http;
  }
  getAll(): Observable<Array<Account>> {
    return this.http.get(AppUtils.BACKEND_API_ROOT_URL + '/users')
      .map((res: Response) => {
        const users: Array<Account> = [];
        const jsonResults: Array<any> = res.json();

        jsonResults.forEach((jsonResult) => {
          const authorities: Array<string> = [];
          const account: Account = new Account(jsonResult);
          for (let i = 0; i < account.authorities.length; i++) {

            const obj: Authority = account.authorities[i];
            authorities.push(obj.authority);
          }
          account.authoritiesStringArray = authorities;
          users.push(account);
        });
        return users;
      });
  }
  getById(id: string): Observable<Account> {
    return this.http.get(AppUtils.BACKEND_API_ROOT_URL + '/users/' + id).map((res: Response) => {
      return new Account(res.json());
    });
  }
  getProfiles(): Observable<Array<string>> {
    return this.http.get(AppUtils.BACKEND_API_ROOT_URL + '/users/profiles').map((res: Response) => res.json());
  }
  saveUser(account: Account): Observable<Account> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put(AppUtils.BACKEND_API_ROOT_URL + '/users/' + account.id, JSON.stringify(account), {headers: headers})
      .map((res: Response) => {
        return new Account(res.json());
      });
  }
}
