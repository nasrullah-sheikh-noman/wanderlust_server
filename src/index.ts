import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import type { Request, Response } from "express";
dotenv.config()

const app = express();
const PORT = Number(process.env.PORT) || 8000;
app.use(cors());
app.use(express.json());
const URI = process.env.MONGODB_URI

if (!URI) {
  throw new Error("MONGODB URI is missing form .env");
}

const client = new MongoClient(URI);

app.use(express.json());

app.get('/', (req : Request, res: Response) => {
  res.send("Server is running")
})

async function startServer() {
  try {
    await client.connect();
    const db = client.db("wanderlust");
    const destinationcollections = db.collection("destinations");
    const bookingCollectins = db.collection("bookings");

    app.get('/destinations', async(req, res) => {
      const result = await destinationcollections.find().toArray();
      res.json(result)
    })

    app.post('/destination', async (req, res) => {
      // console.log("req", req);
      const destinationData = req.body;
      // console.log("destinationData", destinationData);
      const result = await destinationcollections.insertOne(destinationData)
      res.send(result)
    })

    app.patch('/destinations/:id', async (req, res) => {
      const { id } = req.params
      const updatedData = req.body
      // console.log("updated data", updatedData);
      const result = await destinationcollections.updateOne({ _id: new ObjectId(id) }, { $set: updatedData });
      res.json(result)
    })

    app.get('/destinations/:id', async (req, res) => {
      const { id } = req.params;
      const result = await destinationcollections.findOne({ _id: new ObjectId(id) });
      res.json(result)
    })

    app.delete('/destinations/:id', async (req, res) => {
      const { id } = req.params;
      const result = await destinationcollections.deleteOne({ _id: new ObjectId(id) });
      res.json(result)
    })

    app.get('/bookings/:userId', async (req, res) => {
      const { userId } = req.params;
      const result = await bookingCollectins.find({userId}).toArray();
      res.json(result)
    })

    app.post('/booking', async (req, res) => {
      const bookingData = req.body;
      const result = await bookingCollectins.insertOne(bookingData);
      res.json(result)
    })

    app.delete('/booking/:bookingId', async(req, res) => {
      const { bookingId } = req.params;
      const result = await bookingCollectins.deleteOne({ _id: new ObjectId(bookingId) });
      res.json(result)
    })

    console.log("Successfully connected to MONGODB!");
    app.listen(PORT, () => {
      console.log(`app listening port ${PORT}`);
    });
  } catch(error) {
    console.log("Failed to start server: ", error);
    await client.close().catch(() => {})
    process.exit(1);
  }
}

startServer();