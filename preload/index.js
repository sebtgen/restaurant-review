const mongoose = require("mongoose");
const Restaurant = require("../models/restaurant");
const cities = require("./citiesUruguay");
const {names, secondNames} = require("./restaurantNames");
mongoose.connect("mongodb://127.0.0.1:27017/restaurant-review");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Connected");
});

const sampleRestaurant = function (array) {
  return array[Math.floor(Math.random() * array.length)];
};

const preloadDB = async function () {
  await Restaurant.deleteMany({});

  for (let i = 0; i <= 30; i++) {
    const randomRestaurants = Math.floor(Math.random() * 100);
    const oneRestaurant = new Restaurant({
      location: `${cities[randomRestaurants].nombre}, ${cities[randomRestaurants].departamento}`,
      title: `${sampleRestaurant(names)} ${sampleRestaurant(secondNames)}`,
      description: "Test",
      alo: "Nani",
    });
    await oneRestaurant.save();
  }
};

preloadDB().then(function () {
  mongoose.connection.close();
});
