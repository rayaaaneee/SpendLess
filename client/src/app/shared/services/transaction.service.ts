import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  apiURL = `${ environment.apiUrl }/operations`;
  accountUrl = `${ environment.apiUrl }/accounts`;

  constructor() { }

  async getTransactionsFromId(token : string | null){
    const response = await fetch(this.accountUrl + "/" + token + "/operations");
    const data = await response.json();
    return this.parseOperations(data);
  }

  async createTransaction(transaction : Transaction){
    const response = await fetch(this.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    const data = await response.json();
    return data;
  }

  async deleteTransaction(id : number){
    const response = await fetch(this.apiURL + "/" + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  async updateTransaction(transaction : Transaction){
    const response = await fetch(this.apiURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(transaction)
    });
    const data = await response.json();
    return data;
  }

  parseOperations(json: any): Transaction[]{
    let operations = json
    let transactions : Transaction[] = []
    for(let operation of operations){
      const date = new Date(parseInt(operation.date));

      const day = date.getDate().toString();
      const month = (date.getMonth() + 1).toString(); // Months are 0-indexed
      const year = date.getFullYear();

      const formattedDate = `${day}-${month}-${year}`
      let transaction = new Transaction(operation.id, operation.price, operation.category_id, operation.user_id, formattedDate)
      transactions.push(transaction)
    }
    console.log(transactions)
    return transactions
  }
}
