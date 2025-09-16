import {connectToDatabase} from "./connectMongo.ts";
import {PublishedCatalog, ValidatePublishedCatalog} from "@domain/catalog/catalog.ts";

interface GetPublishedCatalogProps {
    MONGO_URI: string;
    MONGO_MAIN_DB: string;
}

interface GetPublishedCatalogReturnProps {
    publishedCatalog: PublishedCatalog;
    report: {
        publishedCatalogLatency: number;
    }
}

export async function getPublishedCatalog(props: GetPublishedCatalogProps): Promise<GetPublishedCatalogReturnProps | Error> {
    const start = Date.now();
    const {mainDb} = await connectToDatabase({...props});
    const publishedCatalog = await mainDb.collection<PublishedCatalog>("publishedCatalogs").find({}).toArray();
    if (publishedCatalog.length === 0) {
        throw new Error("No published catalog found");
    }
    const catalog = publishedCatalog[0];
    let err: Error | null = ValidatePublishedCatalog(catalog);
    if (err !== null) {
        throw err;
    }
    return {
        publishedCatalog: catalog,
        report: {
            publishedCatalogLatency: Date.now() - start
        }
    };
}
