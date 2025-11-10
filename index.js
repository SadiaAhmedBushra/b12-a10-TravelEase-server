
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://travelEase-db:eNpq6WSxuVTu7nN4@cluster0.lpz93gz.mongodb.net/?appName=Cluster0";
const cors = require('cors');
const express = require('express');
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

// travelEase-db
// eNpq6WSxuVTu7nN4


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const db = client.db("travelEase-db");
    const vehicleCollection = db.collection("vehicles");

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    app.get('/vehicles', async (req, res) => {
      const result = await vehicleCollection.find().toArray();
      res.send(result);
    });

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });


  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
