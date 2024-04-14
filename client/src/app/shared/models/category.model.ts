export class Category {
  id? : number;
  title : string;
  user_id : number;

  constructor(id : number, title : string, user_id : number) {
    this.id = id;
    this.title = title;
    this.user_id = user_id;
  }
}
