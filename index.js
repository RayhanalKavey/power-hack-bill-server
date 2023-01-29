const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

require("dotenv").config();
require("colors");

const app = express();
const port = process.env.PORT || 5005;

// const bills = require("./bills.json");

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// app.get("/bills", (req, res) => {
//   res.send(bills);
// });
//--1 bills Collection
const billsCollection = client.db("powerHackBilling").collection("bills");
//--2 bills Collection
const usersCollection = client.db("powerHackBilling").collection("users");
// Add bill to the bills collection
app.post("/add-billing", async (req, res) => {
  try {
    const bill = req.body;
    const result = await billsCollection.insertOne(bill);
    res.send({
      success: true,
      message: "Bill details added successfully",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
//--1 get billing data from the data base and send response to the client site
app.get("/billing-list", async (req, res) => {
  try {
    const query = {};
    const cursor = billsCollection.find(query);
    const bills = await cursor.toArray();
    res.send({
      success: true,
      message: "Successfully got the bills data",
      data: bills,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
//---1 Delete bills
app.delete("/delete-billing/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // console.log(id);
    const query = { _id: ObjectId(id) };
    const result = await billsCollection.deleteOne(query);
    res.send({
      success: true,
      message: "Bill deleted successfully",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
//--2 Registration
app.post("/registration", async (req, res) => {
  try {
    /// console.log("Request body for registration", req.body);
    const { name, email, password } = req.body;
    const result = await usersCollection.insertOne({
      name,
      email,
      password,
    });
    res.send({
      success: true,
      message: "User registered successfully!",
      data: result,
    });
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await usersCollection.findOne({ email, password });
    console.log("Logged in user", result);
    if (result) {
      res.send({
        success: true,
        message: "User logged in successfully!",
        data: result,
      });
    } else {
      res.send({
        success: false,
        // error: error.message,
        error: "Invalid credentials",
      });
    }
  } catch (error) {
    res.send({
      success: false,
      error: error.message,
    });
  }
});
///------------------
app.get("/", (req, res) => {
  res.send("Welcome to the Power Hack server.");
});

app.listen(port, () => {
  console.log(`Power Hack server in running on port: ${port}`.rainbow.bgWhite);
});
