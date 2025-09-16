import {MongoClient, Db} from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedMainDb: Db | null = null;

interface connectToDatabaseCfg {
    MONGO_URI: string;
    MONGO_MAIN_DB: string;
}

interface connectToDatabaseReturnProps {
    client: MongoClient;
    mainDb: Db;
}

export async function connectToDatabase(cfg: connectToDatabaseCfg): Promise<connectToDatabaseReturnProps> {
    const MONGO_URI = cfg.MONGO_URI;
    const MONGO_MAIN_DB = cfg.MONGO_MAIN_DB;

    // check the MongoDB URI
    if (!MONGO_URI) {
        throw new Error('Define the MONGO_URI environmental variable');
    }

    // check the MongoDB DB
    if (!MONGO_MAIN_DB) {
        throw new Error('Define the MONGO_MAIN_DB environmental variable');
    }

    // check the cached.
    if (cachedClient && cachedMainDb) {
        // load from cache
        return {
            client: cachedClient,
            mainDb: cachedMainDb,
        };
    }

    // Connect to cluster
    let client: MongoClient = new MongoClient(MONGO_URI);
    await client.connect();
    let mainDb = client.db(MONGO_MAIN_DB);

    // set cache
    cachedClient = client;
    cachedMainDb = mainDb;

    return {
        client: cachedClient,
        mainDb: cachedMainDb,
    };
}
