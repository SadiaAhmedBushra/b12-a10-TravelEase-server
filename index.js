require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.lpz93gz.mongodb.net/?appName=Cluster0`;
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();
    const db = client.db("travelEase-db");
    const vehicleCollection = db.collection("vehicles");
    const bookingCollection = db.collection("bookings");

    // app.get("/vehicles", async (req, res) => {
    //   const result = await vehicleCollection.find().toArray();
    //   res.send(result);
    // });

    app.get("/vehicles", async (req, res) => {
      try {
        const { userEmail } = req.query;

        let filter = {};
        if (userEmail) {
          filter = { userEmail: userEmail };
        }

        const result = await vehicleCollection.find(filter).toArray();

        res.send(result);
      } catch (error) {
        console.error(
          "Unexpected error occurred while fetching vehicles:",
          error
        );
        res.send({ success: false, message: "Unexpected server error!" });
      }
    });

    app.post("/vehicles", async (req, res) => {
      const newVehicleData = req.body;
      const result = await vehicleCollection.insertOne(newVehicleData);
      res.send(result);
    });

    app.get("/vehicles/:id", async (req, res) => {
      const { id } = req.params;
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

    app.post("/bookings", async (req, res) => {
      try {
        const booking = req.body;
        booking.createdAt = new Date();

        const result = await bookingCollection.insertOne(booking);
        res.send({ success: true, result });
      } catch (error) {
        res.send({
          success: false,
          message: "Booking Failed due to Unexpected Errors",
        });
      }
    });

    app.get("/bookings", async (req, res) => {
      try {
        const userEmail = req.query.userEmail;
        const filter = userEmail ? { userEmail } : {};

        const result = await bookingCollection.find(filter).toArray();
        res.send(result);
      } catch (error) {
        res.send({
          success: false,
          message: "Unexpected error occurred while fetching bookings.",
        });
      }
    });

    app.delete("/vehicles/:id", async (req, res) => {
      const { id } = req.params;

      const result = await vehicleCollection.deleteOne({
        _id: new ObjectId(id),
      });

      res.send({
        success: true,
        result,
      });
    });

    app.get("/latest-vehicles", async (req, res) => {
      const result = await vehicleCollection
        .find()
        .sort({ createdAt: -1 })
        .limit(6)
        .toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
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
