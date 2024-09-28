const db = require("../config/connection");
const { User, SeedPackage } = require("../models");
const seedPackageSeeds = require("./seedPackageSeeds.json");
const userSeeds = require("./userSeeds.json");
const cleanDB = require("./cleanDB");

db.once("open", async () => {
  try {
    await cleanDB("User", "users");
    await cleanDB("SeedPackage", "seedPackages");

    await User.create(userSeeds);
    await SeedPackage.create(seedPackageSeeds);

    await console.log("~ 🌱 User and Seed Package Data Seeded 🌱 ~");
    process.exit(0);
  } catch (err) {
    throw err;
  }
});
