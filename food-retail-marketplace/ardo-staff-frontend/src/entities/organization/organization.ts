import {MlString} from "../base/MlString";
import {OrgContact} from "./valueobject/orgContact";
import {Paginate} from "../base/paginate";

type OrgLogoImgUrl = string;

export type Organization = {
    id: UUID;
    logo: OrgLogoImgUrl;
    currency: Currency;
    orgName: MlString;
    orgDesc: MlString;
    orgContact: OrgContact;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export type OrganizationsData = {
    organizations: Organization[];
    organizationsCount: number;
}

export type OrganizationsGetRequest = Paginate;
