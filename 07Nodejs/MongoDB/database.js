const { MongoClient } = require("mongodb");

const url = "mongodb+srv://ayushnagar5350_db_user:23eucei008@ayushnode.b2lc2w0.mongodb.net/"


const client = new MongoClient(url);

const dbName = "HelloWorld";

async function main() {
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("User");

  // the following code examples can be pasted here...

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());