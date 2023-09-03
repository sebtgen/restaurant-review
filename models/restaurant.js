const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  title: String,
  description: String,
  location: String,
  //   dishes: [String],
});

module.exports = mongoose.model("Restaurant", RestaurantSchema);
