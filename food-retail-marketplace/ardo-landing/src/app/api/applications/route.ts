import {v4 as uuidv4} from 'uuid';
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import {Langs} from "@/domain/mlString/mlString";
import {connectToDatabase} from "@/pkg/mongo/mongo";
import {responseError} from "@/pkg/http/response";
import {translate} from "@/pkg/translate/translate";
import {validateEmail} from "@/pkg/email/email";
import {validatePhone} from "@/pkg/phone/phone";

interface ApplicationIn {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    businessName: string,
}

export async function POST(req: Request) {
    try {
        const lang = headers().get('accept-language') as Langs;
        if (!lang) {
            return NextResponse.json(responseError(['X-Language header is required']), {status: 400});
        }
        if (!(lang in Langs)) {
            return NextResponse.json(responseError(['X-Language header is invalid']), {status: 400});
        }

        const {firstName, lastName, email, phone, businessName} = await req.json() as ApplicationIn;
        if (!firstName) {
            return NextResponse.json(responseError([translate('first_name_empty', lang)]), {status: 400});
        }
        if (!lastName) {
            return NextResponse.json(responseError([translate('last_name_empty', lang)]), {status: 400});
        }
        if (!email) {
            return NextResponse.json(responseError([translate('email_empty', lang)]), {status: 400});
        }
        if (!validateEmail(email)) {
            return NextResponse.json(responseError([translate('email_invalid', lang)]), {status: 400});
        }
        if (!phone) {
            return NextResponse.json(responseError([translate('phone_empty', lang)]), {status: 400});
        }
        if (!validatePhone(phone)) {
            return NextResponse.json(responseError([translate('phone_invalid', lang)]), {status: 400});
        }
        if (!businessName) {
            return NextResponse.json(responseError([translate('business_name_empty', lang)]), {status: 400});
        }

        const {mainDb} = await connectToDatabase({
            MONGO_URI: process.env.MONGO_URI || "",
            MONGO_MAIN_DB: process.env.MONGO_MAIN_DB || ""
        });

        const newApplication = await mainDb.collection('applications').insertOne({
            "_id": uuidv4() as any,
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "phone": phone,
            "businessName": businessName,
            "createdAt": new Date(),
        });
        return NextResponse.json({message: translate('application_submitted', lang)}, {status: 200});
    } catch (e) {
        return NextResponse.json(responseError([translate('internal_server_error', Langs.EN)]), {status: 500});
    }
}
