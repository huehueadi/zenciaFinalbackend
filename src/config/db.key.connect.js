import { MongoClient } from 'mongodb';

const uri = "mongodb+srv://zfintechpvtltd:sMCG5UFvbXzdHrVK@cluster0.zvosn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = 'keys';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let cachedDb = null;

async function connectToDB() {
  if (cachedDb) {
    console.log('Reusing existing MongoDB connection');
    return cachedDb;
  }

  try {
    console.log('Connecting to MongoDB with URI:', uri.replace(/:([^@]+)@/, ':<password>@'));
    await client.connect();
    console.log('MongoDB connected');
    const db = client.db(dbName);
    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

process.on('SIGINT', async () => {
  if (client) {
    await client.close();
    console.log('MongoDB connection closed');
  }
  process.exit(0);
});

export default connectToDB