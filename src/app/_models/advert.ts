import { Province } from "./province";

export class Advert{
    id?: number;
    headline: string;
    province: string;
    city: string;
    status: string;
    hidden: boolean;
    deleted: boolean;
    advertDetails: string;
    price: number;
}