import dotenv from "dotenv";
import express from "express";
import { MongoClient } from 'mongodb';
import type { Request, Response } from "express";
dotenv.config()

const app = express();
const PORT = process.env.PORT;

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

    app.post('/destination', async(req, res) => {
      const destinationData = req.body;
      const result = await destinationcollections.insertOne(destinationData)
      res.send(result)
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