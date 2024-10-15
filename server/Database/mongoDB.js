import { MongoClient } from "mongodb";
import { loggerMongoDB } from "../Utils/logger.js";

const MONGO_CONNECTION_STRING = process.env.MONGO_CONNECTION_STRING;
const MONGO_DATABASE = process.env.MONGO_DATABASE;
const MONGO_COLLECTION_EXAMPLES = process.env.MONGO_COLLECTION_EXAMPLES;
const MONGO_COLLECTION_SCHEMAS = process.env.MONGO_COLLECTION_SCHEMAS;

async function mongoRetrieveOne(database, collection, client) {
  try {
    const db = client.db(database);
    const coll = db.collection(collection);

    const filter = {
      schemaVersion: "withExampleDistinctValuesProperColumnDescriptions",
    };
    const options = {
      // Exclude _id and schemaVersion fields from the returned document
      projection: { _id: 0, schemaVersion: 0 },
    };
    const document = await coll.findOne(filter, options);
    loggerMongoDB.info(`📄 Retrieved a db schema.`);

    return document;
  } catch (error) {
    loggerMongoDB.error("❌ An error occurred during mongoRetrieveOne call.");
    throw error;
  }
}

async function mongoRetrieveMany(database, collection, client) {
  try {
    const db = client.db(database);
    const coll = db.collection(collection);

    const options = {
      // Exclude _id field from the returned document
      projection: { _id: 0 },
    };

    const documents = await coll.find({}, options).toArray();
    loggerMongoDB.info(
      `📄 Retrieved a total of ${documents.length} examples.`
    );

    return documents;
  } catch (error) {
    loggerMongoDB.error("❌ An error occurred during mongoRetrieveMany call.");
    throw error;
  }
}

export async function loadDbInformation() {
  let client;
  try {
    client = new MongoClient(MONGO_CONNECTION_STRING);

    const dbSchema = await mongoRetrieveOne(
      MONGO_DATABASE,
      MONGO_COLLECTION_SCHEMAS,
      client
    );
    const examplesForSQL = await mongoRetrieveMany(
      MONGO_DATABASE,
      MONGO_COLLECTION_EXAMPLES,
      client
    );

    loggerMongoDB.info("Successfully loaded database information! ✅");
    return {
      dbSchema: dbSchema,
      examplesForSQL: examplesForSQL,
    };
  } catch (error) {
    loggerMongoDB.error(
      "❌ An error occurred while loading database information."
    );
    loggerMongoDB.error(error);

    return {
      dbSchema: null,
      examplesForSQL: [],
    };
  } finally {
    if (client) {
      client.close();
    }
  }
}
