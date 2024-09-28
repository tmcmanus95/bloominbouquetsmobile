const mongoose = require("mongoose");

const { Schema } = mongoose;

const seedPackage = new Schema({
  quantity: {
    type: Number,
    min: 5000,
    default: 5000,
  },
  price: {
    type: Number,
    required: true,
    min: 0.99,
  },
});

const SeedPackage = mongoose.model("SeedPackage", seedPackage);

module.exports = SeedPackage;
