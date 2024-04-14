import { Account } from "./account.model"
import { Category } from "./category.model";

export class Transaction {

  id? : number;
  price : number;
  category_id : number;
  token : string;
  date: string;

  constructor(id : number, price : number, category_id : number, token : string, date : string) {
    this.id = id;
    this.price = price;
    this.category_id = category_id;
    this.token = token;
    this.date = date;
  }
}
