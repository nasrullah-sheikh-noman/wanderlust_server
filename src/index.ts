import express from "express";
import type { Request, Response } from "express";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/', (req : Request, res: Response) => {
  res.send("Hello users")
})

app.listen(PORT, () => {
  console.log(`app listening port ${PORT}`);
})