import mongoose from "mongoose";

const uri1 = "mongodb://ramyapuppala_db_user:Ramya123@cluster0-shard-00-00.wyj1c.mongodb.net:27017,cluster0-shard-00-01.wyj1c.mongodb.net:27017,cluster0-shard-00-02.wyj1c.mongodb.net:27017/staysmart?ssl=true&replicaSet=atlas-fk2jqw-shard-0&authSource=admin";
const uri2 = "mongodb+srv://ramyapuppala_db_user:Ramya123@cluster0.wyj1c.mongodb.net/staysmart?retryWrites=true&w=majority";
const uri3 = "mongodb://127.0.0.1:27017/staysmart";

async function testConnection(uri, label) {
  console.log(`Testing ${label}...`);
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log(`SUCCESS: ${label} connected! Host:`, conn.connection.host);
    await mongoose.disconnect();
  } catch (err) {
    console.error(`FAILED: ${label} error:`, err.message);
  }
}

async function run() {
  await testConnection(uri1, "Current MONGO_URI");
  await testConnection(uri2, "SRV MONGO_URI");
  await testConnection(uri3, "Local MONGO_URI");
}

run();
