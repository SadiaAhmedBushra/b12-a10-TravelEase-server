const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://travelEase-db:eNpq6WSxuVTu7nN4@cluster0.lpz93gz.mongodb.net/?appName=Cluster0";
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// travelEase-db
// eNpq6WSxuVTu7nN4

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("travelEase-db");
    const vehicleCollection = db.collection("vehicles");

    app.get("/vehicles", async (req, res) => {
      const result = await vehicleCollection.find().toArray();
      res.send(result);
    });

    app.post("/vehicles", async (req, res) => {
      const newVehicleData = req.body;
      const result = await vehicleCollection.insertOne(newVehicleData);
      res.send(result);
    });

    app.get("/vehicles/:id", async (req, res) => {
      const { id } = req.params;
      // const id = req.params.id;
      // const query = { _id: new require('mongodb').ObjectId(id) };
      const result = await vehicleCollection.findOne({ _id: new ObjectId(id) });
      res.send({
        success: true,
        result,
      });
    });

    app.put("/vehicles/:id", async (req, res) => {
      const { id } = req.params;
      const data = req.body;
      const objectID = new ObjectId(id);
      const filter = { _id: objectID };
      const updateDoc = {
        $set: data,
      };

      const result = await vehicleCollection.updateOne(filter, updateDoc);
      if (result.matchedCount === 0) {
        return res
          .status(404)
          .send({ success: false, message: "Vehicle not found" });
      }
      res.send({ success: true, result });
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);
