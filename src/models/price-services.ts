export class Prices{
    id:number;
    imageUrl:string;
    title:string;
    price:number;
    description:string;

    constructor (id:number, imageUrl:string, title:string, price:number, description:string) {
        this.id = id;
        this.imageUrl = imageUrl;
        this.title = title;
        this.price = price;
        this.description = description;
    }
}