import { CUSTOM_ELEMENTS_SCHEMA, Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Category } from '../../shared/models/category.model';
import { CategoryService } from '../../shared/services/category.service';
import { AccountService } from '../../shared/services/account.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';



@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule,
    ToastModule,
    InputTextModule,
    FormsModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss',
  providers: [MessageService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class CategoryComponent {

  newCategoryName: Event |undefined = undefined;

  constructor(private messageService: MessageService, 
    private categoryService: CategoryService, 
    private accountService: AccountService,
    private router: Router,
    ) {
  }

  onCreate() {
    if (this.newCategoryName) {
      
      let accountId = this.accountService.getId();
      console.log(accountId);
      if (accountId !== null) {
        let category = new Category(-1, this.newCategoryName as unknown as string, accountId);
        console.log()
        this.categoryService.createCategory(category).then((data) => {
          if (data.changes > 0) {
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created' });
            setTimeout(() => {
              this.router.navigate(['/spend']);
            }
            , 500);
          } else {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Category not created' });
          }
        });
      }
    }
  }
}
