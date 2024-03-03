import {MongoClient, Db} from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedMainDb: Db | null = null;
let cachedIikoDb: Db | null = null;
let cachedRkeeperDb: Db | null = null;
let cachedReadModelDb: Db | null = null;

interface connectToDatabaseCfg {
    MONGO_URI: string;
    MONGO_MAIN_DB: string;
    MONGO_IIKO_DB: string;
    MONGO_RKEEPER_DB: string;
    MONGO_READMODEL_DB: string;
}

interface connectToDatabaseReturnProps {
    client: MongoClient;
    mainDb: Db;
    iikoDb: Db;
    rkeeperDb: Db;
    readModelDb: Db;
}

export async function connectToDatabase(cfg: connectToDatabaseCfg): Promise<connectToDatabaseReturnProps> {
    const MONGO_URI = cfg.MONGO_URI;
    const MONGO_MAIN_DB = cfg.MONGO_MAIN_DB;
    const MONGO_IIKO_DB = cfg.MONGO_IIKO_DB;
    const MONGO_RKEEPER_DB = cfg.MONGO_RKEEPER_DB;
    const MONGO_READMODEL_DB = cfg.MONGO_READMODEL_DB;

    // check the MongoDB URI
    if (!MONGO_URI) {
        throw new Error('Define the MONGO_URI environmental variable');
    }

    // check the MongoDB DB
    if (!MONGO_MAIN_DB) {
        throw new Error('Define the MONGO_MAIN_DB environmental variable');
    }

    // check the MongoDB IIKO DB
    if (!MONGO_IIKO_DB) {
        throw new Error('Define the MONGO_IIKO_DB environmental variable');
    }

    // check the MongoDB RKEEPER DB
    if (!MONGO_RKEEPER_DB) {
        throw new Error('Define the MONGO_RKEEPER_DB environmental variable');
    }

    // check the MongoDB READMODEL DB
    if (!MONGO_READMODEL_DB) {
        throw new Error('Define the MONGO_READMODEL_DB environmental variable');
    }

    // check the cached.
    if (cachedClient && cachedMainDb && cachedIikoDb && cachedRkeeperDb && cachedReadModelDb) {
        // load from cache
        return {
            client: cachedClient,
            mainDb: cachedMainDb,
            iikoDb: cachedIikoDb,
            rkeeperDb: cachedRkeeperDb,
            readModelDb: cachedReadModelDb,
        };
    }

    // Connect to cluster
    let client: MongoClient = new MongoClient(MONGO_URI);
    await client.connect();
    let mainDb = client.db(MONGO_MAIN_DB);
    let iikoDb = client.db(MONGO_IIKO_DB);
    let rkeeperDb = client.db(MONGO_RKEEPER_DB);
    let readModelDb = client.db(MONGO_READMODEL_DB);

    // set cache
    cachedClient = client;
    cachedMainDb = mainDb;
    cachedIikoDb = iikoDb;
    cachedRkeeperDb = rkeeperDb;
    cachedReadModelDb = readModelDb;

    return {
        client: cachedClient,
        mainDb: cachedMainDb,
        iikoDb: cachedIikoDb,
        rkeeperDb: cachedRkeeperDb,
        readModelDb: cachedReadModelDb,
    };
}
