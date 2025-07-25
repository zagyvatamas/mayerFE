export class ReservationServices{
    id?:number;
    service_id?:number;
    client_name?:string;
    date?:Date;
    start_time?:Date;
    duration_minutes?:number;
    status?:string;
    client_email?:string;
}

export class ServiceData{
    id:number;
    name:string;
    description:string;
    duration_minutes:number;
    price:number;

    constructor (id:number,name:string,description:string,duration_minutes:number, price:number) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.duration_minutes = duration_minutes;
        this.price = price
    }
}