export class Operation {
    id: number;
    price: number;
    date: Date;
    category_id: number;
    user_id: number;

    constructor(id: number, price: number, date: Date, category_id: number, user_id: number) {
      this.id = id;
      this.price = price;
      this.date = date;
      this.category_id = category_id;
      this.user_id = user_id;
    }

    toJsonObject() {
      return {
        id: this.id,
        price: this.price,
        date: this.date,
        category_id: this.category_id,
        user_id: this.user_id
      }
    }
}