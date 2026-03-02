import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;

if (!uri) {
  throw new Error("Please define the MONGODB_URI in .env.local");
}

declare global {
  // Prevent multiple connections in development
  // eslint-disable-next-line no-var
  var _mongoClient: MongoClient | undefined;
  var _mongoDb: Db | undefined;
}

export async function dbConnect(): Promise<Db> {
  if (global._mongoDb) {
    return global._mongoDb;
  }

  const client =
    global._mongoClient || new MongoClient(uri);

  if (!global._mongoClient) {
    global._mongoClient = client;
    await client.connect();
  }

  const db = client.db(); // Uses DB name from URI
  global._mongoDb = db;

  return db;
}