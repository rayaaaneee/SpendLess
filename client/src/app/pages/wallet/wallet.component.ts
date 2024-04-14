import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputNumberModule} from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccountService } from '../../shared/services/account.service';

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, InputNumberModule, FormsModule, ToastModule],
  providers: [MessageService],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.scss'
})
export class WalletComponent implements OnInit {

  balance: number = 0;

  toAdd: number = 0;

  constructor(
    private messageService: MessageService,
    private accountService: AccountService
  ) {
  }

  ngOnInit(): void {
    const token: string | null = this.accountService.getToken();
    if (token === null) {
      this.messageService.add({severity:'error', summary:'You are not logged in !'});
      return;
    } else {
      this.accountService.getAccountByToken().then(account => {
        this.balance = account.balance;
      });
    }
  }

  getColor() {
    return this.balance >= -100 ? (this.balance >= 0 ? (this.balance >= 100 ? (this.balance >= 500 ? (this.balance >= 1500 ? 'ultra-green' : 'green') : 'grey') : 'yellow') : 'red') : 'ultra-red';
  }

  async addToBalance(e: Event) {
    e.preventDefault();
    if (this.toAdd === 0) {
      this.messageService.add({severity:'warn', summary:'Add 0.00 € doesn\'t change your balance !', life: 3000});
    } else if (this.toAdd < 0) {
      this.messageService.add({severity:'error', summary:'You can\'t add a negative amount !', life: 3000});
    } else {
      this.balance += this.toAdd;
      let balanceTmp: number = this.balance;
      const response: any = await this.accountService.updateBalance(this.toAdd);
      this.toAdd = 0;
      console.log(response);
      if (response.success) {
        this.messageService.add({severity:'success', summary:`You successfully added ${balanceTmp.toFixed(2)}€ to your balance !`});
      } else {
        this.messageService.add({severity:'error', summary:"An error occured while updating your balance !"});
      }
    }
  }
}
