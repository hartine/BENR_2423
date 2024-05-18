const { MongoClient, ServerApiVersion } = require('mongodb');
async function main() {
  const uri = "mongodb+srv://b022210196:gjass3YaeDXQfOhv@cluster0.d7k674t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true, }
  });

  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to MongoDB')

    // Define the aggregation pipeline
    const pipeline = [
      {
        '$match': {
          'name': 'Leslie Martinez'}
      }, {
        '$lookup': {
          'from': 'accounts', 
          'localField': 'accounts', 
          'foreignField': 'account_id', 
          'as': 'ACCOUNTDETAILS'}}
    ];

    // Perform the aggregation operation
    const result = await client.db('sample_analytics').collection('customers').aggregate(pipeline).toArray();
    console.log(result);

  } catch (e) {
    console.error(e);
  } finally {
    await client.close();}
}

main().catch(console.error);

