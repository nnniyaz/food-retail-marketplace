import {MlString} from "../base/MlString";
import {OrgContact} from "./valueobject/orgContact";
import {Paginate} from "../base/paginate";
import {Currency} from "../base/currency";

type OrgLogoImgUrl = string;
type OrgName = string;

export type Organization = {
    id: UUID;
    logo: OrgLogoImgUrl;
    currency: Currency;
    name: OrgName;
    orgDesc: MlString;
    orgContact: OrgContact;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type OrganizationsData = {
    orgs: Organization[];
    count: number;
}

export type OrganizationsGetRequest = Paginate;
