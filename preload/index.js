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
    const imgNumber = Math.floor(Math.random() * 11) + 1;
    const randomRestaurants = Math.floor(Math.random() * 100);
    const oneRestaurant = new Restaurant({
      location: `${cities[randomRestaurants].nombre}, ${cities[randomRestaurants].departamento}`,
      title: `${sampleRestaurant(names)} ${sampleRestaurant(secondNames)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Reiciendis fugiat fugit maxime impedit iure minima consectetur quaerat ratione eligendi laborum modi assumenda ab tempora quas, eaque neque, ea a eius.",
      image: `1(${imgNumber}).jpg`,
    });
    await oneRestaurant.save();
  }
};

preloadDB().then(function () {
  mongoose.connection.close();
});
