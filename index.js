const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const Restaurant = require("./models/restaurant");
const handleAsync = require("./misc/handleAsync");
const errorHandler = require("./misc/errorHandler");
// ---------------------- //

mongoose.connect("mongodb://127.0.0.1:27017/restaurant-review");
const db = mongoose.connection;

db.on("error", console.error.bind(console, "Error:"));
db.once("open", function () {
  console.log("Connected");
});

app.engine("ejs", engine);
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(express.static("images"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get(
  "/restaurants",
  handleAsync(async function (req, res) {
    const restaurants = await Restaurant.find({});
    res.render("restaurants/index", {restaurants});
  })
);

app.post(
  "/restaurants",
  handleAsync(async function (req, res) {
    if (!req.body.campground) {
      throw new errorHandler("Invalid data", 400);
    }
    const restaurant = new Restaurant(req.body.restaurant);
    await restaurant.save();
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

app.get("/restaurants/new", function (req, res) {
  res.render("restaurants/new");
});

app.get(
  "/restaurants/:id",
  handleAsync(async function (req, res) {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render("restaurants/show", {restaurant});
  })
);

app.get(
  "/restaurants/:id/edit",
  handleAsync(async function (req, res) {
    const restaurant = await Restaurant.findById(req.params.id);
    res.render("restaurants/edit", {restaurant});
  })
);

app.put(
  "/restaurants/:id",
  handleAsync(async function (req, res) {
    const {id} = req.params;
    const restaurant = await Restaurant.findByIdAndUpdate(id, {...req.body.restaurant});
    res.redirect(`/restaurants/${restaurant._id}`);
  })
);

app.delete(
  "/restaurants/:id",
  handleAsync(async function (req, res) {
    const {id} = req.params;
    await Restaurant.findByIdAndDelete(id);
    res.redirect("/restaurants");
  })
);

app.all("*", (req, res, next) => {
  next(new errorHandler("Page not found", 404));
});

app.use((err, req, res, next) => {
  const {status = 500} = err;
  if (!err.message) {
    err.message = "Something went wrong";
  }
  res.status(status).render("error", {err});
});

app.listen(3000);
