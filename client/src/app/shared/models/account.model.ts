export class Account {

  id : number;
  username : string;
  password: string;
  balance : number;

  constructor(id : number, username : string, password: string, balance : number) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.balance = balance;
  }
}
