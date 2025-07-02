export class RegisterData{
    username:string;
    email:string;
    password:string;
    age:number;
    gender:string;

    constructor (username:string,email:string,password:string,age:number,gender:string) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
        this.gender = gender;
    }
}