import { City } from "./city";
import { Province } from "./province";

export class Advert{
    id?: number;
    headline: string;
    provinceId: number;
    province?: Province;
    city?:City;
    cityId: number;
    price: number;
    status: string;
    hidden: boolean;
    deleted: boolean;
    advertDetails: string;
}