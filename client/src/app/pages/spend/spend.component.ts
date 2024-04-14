import {Title} from "@angular/platform-browser";

import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {DropdownModule} from "primeng/dropdown";
import {InputNumberModule} from "primeng/inputnumber";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {Category} from "../../shared/models/category.model";
import {CategoryService} from "../../shared/services/category.service";
import {TransactionService} from "../../shared/services/transaction.service";
import { CardModule } from 'primeng/card';
import { MessageService } from "primeng/api";
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { AccountService } from "../../shared/services/account.service";




@Component({
  selector: 'app-spend',
  standalone: true,
  imports: [CommonModule, FormsModule, DropdownModule, InputNumberModule, ReactiveFormsModule, CardModule, ToastModule, InputTextModule],
  providers: [MessageService],
  templateUrl: './spend.component.html',
  styleUrl: './spend.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})

export class SpendComponent implements OnInit{

  title: string = 'Spend';
  categoryOptions?: Category[];
  sizeTab: number[] = [];
  selectedCategory?: any;
  selectedCategoryName?: string;

  spendForm: FormGroup = this.fb.group({
    spendAmount: ['', Validators.compose([Validators.required])],
    spendCategory: ['', Validators.compose([Validators.required])],
  });

  constructor(private titleService: Title,
              private fb: FormBuilder,
              private router: Router,
              private categoryService: CategoryService,
              private accountService: AccountService,
              private messageService: MessageService,
              private transactionService: TransactionService) {
    this.titleService.setTitle(this.title);
    this.categoryOptions = [];
  }

  delete(id: number) {
    this.categoryService.deleteCategory(id).then((response) => {
      if(response.success){
        this.categoryOptions = this.categoryOptions?.filter((category) => category.id !== id);
        this.messageService.add({severity:'success', summary:'Category deleted !'});
      }
      else{
        this.messageService.add({severity:'error', summary:'An error occured !'});
      }
    });
  }

  ngOnInit() {
    let token = this.accountService.getToken();
    this.categoryService.getCategoriesFromUser(token).then((categories) => {
      this.categoryOptions = categories;

      if(this.categoryOptions){
        for(let i = 0; i <this.categoryOptions.length; i = i+4){
          this.sizeTab.push(i);
        }
        console.log(this.sizeTab);
      }
    });
  }

  onCategoryChange(e: MouseEvent) {
    let target = e.currentTarget as HTMLElement;
    if(this.selectedCategory){
      this.selectedCategory.classList.remove("catBorder");
    }

    let element = e.currentTarget as HTMLElement;
    element.querySelector(".p-card")!.classList.add("catBorder");
    this.selectedCategory = element.querySelector(".p-card")!;
    this.selectedCategoryName = element.querySelector(".p-card-title")!.innerHTML;

  }

  spend(pay: number, price: number): number {
    return pay - price;
  }

  onSpend(e: SubmitEvent) {
    if(!this.spendForm.value.spendAmount || !this.selectedCategoryName){
      this.messageService.add({severity:'error', summary:'You must enter a value and choose a category !'});
    }
    else{
      let category = this.categoryOptions?.find((category) => category.title === this.selectedCategoryName);

      let token:string = this.accountService.getToken() ?? "";

      if (token == "") {
        this.messageService.add({severity:'error', summary:'An error occured !'});
        return;
      }

      this.transactionService.createTransaction(
        {
          "price": this.spendForm.value.spendAmount,
          "date": Date.now().toString(),
          "category_id": category?.id ?? 1,
          "token": token
        }
      ).then((response) => {
        if(response.success){
          this.messageService.add({severity:'success', summary:'Transaction added !'});
        }
        else{
          this.messageService.add({severity:'error', summary:'An error occured !'});
        }
      });

      // this.router.navigate([""]);
    }

  }

  onAddCategory() {
    this.router.navigate(["/newcat"]);
  }
}
