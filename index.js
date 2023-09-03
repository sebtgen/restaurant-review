const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Restaurant = require("./models/restaurant");

mongoose.connect("mongodb://127.0.0.1:27017/restaurant-review");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error:"));
db.once("open", function () {
  console.log("Connected");
});

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/createrestaurant", async function (req, res) {
  const aRestaurant = new Restaurant({title: "Test restaurant", description: "Test"});
  await aRestaurant.save();
  res.send(aRestaurant);
});

app.listen(3000, function () {
  console.log("Listening on port 3000");
});
