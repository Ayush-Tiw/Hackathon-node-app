import express from "express";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const PORT = 4000;

app.use(express.json());

const mongo_URL = process.env.mongo_URL;

// function to connect to mongodb
async function createConnection() {
  const client = new MongoClient(mongo_URL); 
  await client.connect();
  console.log("Mongodb is connected");
  return client;
}

const client = await createConnection();

//food/:id
app.get("/foods/:id", async function (request, response) {
  const { id } = request.params;
  const food = await client
    .db("hackathon-node-app")
    .collection("foods")
    .findOne({ id: id });
  food
    ? response.send(food)
    : response.status(404).send({ msg: "food not found" });
});

// create food list
app.post("/foods", async function (request, response) {
  const data = request.body;
  console.log(data);

  const result = await client
    .db("hackathon-node-app")
    .collection("foods")
    .insertMany(data);
  response.send(result);
});

// get all foods
app.get("/foods", async function (request, response) {
  const result = await client
    .db("hackathon-node-app")
    .collection("foods")
    .find({})
    .toArray();
  response.send(result);
});

app.listen(PORT, console.log(`app started in port ${PORT}`));
