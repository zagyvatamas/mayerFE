export class LandingServices{
    imageUrl:string;
    title:string;
    text:string;

    constructor(imageurl:string, title:string, text:string) {
        this.imageUrl = imageurl;
        this.title = title;
        this.text = text;
    }
}