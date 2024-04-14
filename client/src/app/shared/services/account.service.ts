import { Injectable } from '@angular/core';
import { Account } from '../models/account.model';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  apiURL = 'http://localhost:3000/accounts';

  public cookieName: string = 'token';

  constructor(
    private cookieService: CookieService
  ) { }

  async getAccounts(){
    const response = await fetch(this.apiURL);
    const data = await response.json();
    return this.parseOperations(data);
  }

  async getAccountByToken() : Promise<Account> {
    console.log(this.apiURL + "/" + this.getToken());
    const response = await fetch(this.apiURL + "/" + this.getToken());
    const data = await response.json();
    return new Account(data.id, data.username, "", data.balance);
  }

  async getAccountByCredentials(username: string, password: string): Promise<any>{

    const response = await fetch(this.apiURL + "/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username: username, password : password})
    });

    const data = await response.json();

    return data;
  }

  async createAccount(account : Account){
    const response = await fetch(this.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    const data = await response.json();
    return data;
  }

  async deleteAccount(token : number){
    const response = await fetch(this.apiURL + "/" + token, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  async updateAccount(account : Account){
    const response = await fetch(this.apiURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(account)
    });
    const data = await response.json();
    return data;
  }

  parseOperations(json: any): Account[]{
    let accounts : Account[] = []
    for(let accountJson of json){
      let account = new Account(accountJson.id, accountJson.username, accountJson.password, accountJson.balance);
      accounts.push(account);
    }
    return accounts;
  }

  getId(): number | null {
    const token = this.cookieService.get(this.cookieName);
    if (token) {
      const payload = token.split('.')[1];
      const decodedPayload = atob(payload);
      const accountJson = JSON.parse(decodedPayload);
      return accountJson.user_id as number;
    }
    return null;
  }

  async updateBalance(balance: number) {
    const response = await fetch(`${this.apiURL}/${this.getToken()}/balance`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ balance })
    });

    const data = await response.json();

    return data;
  }

  getToken(): string | null {
    const token = this.cookieService.get(this.cookieName);
    if (token) {
      return token;
    }
    return null;
  }
}
