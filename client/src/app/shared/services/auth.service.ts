import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AccountService } from './account.service';
import { Account } from '../models/account.model';

@Injectable(
  { providedIn: 'root' }
)
export class AuthService {

  public cookieName: string = 'token';

  public readonly url = 'http://localhost:3000/accounts';

  constructor(
    private cookieService: CookieService,
    private accountService: AccountService
  ) {
  }

  public isAuthenticated(): boolean {
    const token = this.cookieService.get(this.cookieName);
    return token ? true : false;
  }

  public logout(): void {
    this.cookieService.delete(this.cookieName);
  }

  public async login(username: string, password: string): Promise<any> {
    const data = await this.accountService.getAccountByCredentials(username, password);

    if (data.success) {
      this.cookieService.set(this.cookieName, data.token);
    }

    return data;
  }

  public async register(username: string, password: string): Promise<any> {
    let data = await this.accountService.createAccount(new Account(-1, username, password, 0));
    if (data.success) {
      this.cookieService.set(this.cookieName, data.token);
    }
    return data;
  }
}
