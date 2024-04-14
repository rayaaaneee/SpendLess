export class Category {
    id: number;
    title: string;
    user_id: number;

    constructor(id: number, title: string, user_id: number) {
        this.id = id;
        this.title = title;
        this.user_id = user_id;
    }

    toJsonObject() {
        return {
            id: this.id,
            title: this.title,
            user_id: this.user_id
        }
    }
}