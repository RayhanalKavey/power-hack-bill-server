const express = require("express");
const cors = require("cors");

require("dotenv").config();
require("colors");

const app = express();
const port = process.env.PORT || 5005;

//Middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the Power Hack server.");
});

app.listen(port, () => {
  console.log(`Power Hack server in running on port: ${port}`.rainbow.bgWhite);
});
