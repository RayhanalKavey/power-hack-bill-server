const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
require("colors");

const app = express();
const port = process.env.PORT || 5005;

const bills = require("./bills.json");

//Middleware
app.use(cors());
app.use(express.json());

// Db connections
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hufticd.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function dbConnect() {
  try {
    await client.connect();
    console.log("Database connected!".cyan.bgWhite);
  } catch (error) {
    console.log(error.name.bgWhite.red, error.message.red);
  }
}
dbConnect();
app.get("/bills", (req, res) => {
  res.send(bills);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Power Hack server.");
});

app.listen(port, () => {
  console.log(`Power Hack server in running on port: ${port}`.rainbow.bgWhite);
});
