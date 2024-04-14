import { Injectable } from '@angular/core';
import { Category } from '../models/category.model';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  apiURL = 'http://localhost:3000/categories'
  accountUrl = 'http://localhost:3000/accounts'

  constructor(
    private accountService: AccountService
  ) { }


  async getCategoriesFromUser(id: string | null) {
    const response = await fetch(this.accountUrl + "/" + id + "/categories");
    const data = await response.json()
    console.log(data);
    return this.parseOperations(data);
  }

  async getCategory(id : number){
    const response = await fetch(this.apiURL + "/" + id);
    const data = await response.json();
    return this.parseOperations(data);
  }

  async createCategory(category : Category){
    console.log(category)
    const response = await fetch(this.apiURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const data = await response.json();
    return data;
  }

  async deleteCategory(id : number){
    const response = await fetch(this.apiURL + "/" + this.accountService.getToken() + "/" + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    return data;
  }

  async updateCategory(category : Category){
    const response = await fetch(this.apiURL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(category)
    });
    const data = await response.json();
    return data;
  }

  parseOperations(json: any): Category[]{
    let categoriesJson = json
    let categories : Category[] = []
    for(let categoryJson of categoriesJson){
      let category = new Category(categoryJson.id, categoryJson.title, categoryJson.user_id)
      categories.push(category)
    }
    return categories
  }
}
