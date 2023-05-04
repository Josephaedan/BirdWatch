var mongoose = require("mongoose");

var mongoDB = process.env.MONGODB_URI || "mongodb://localhost:27017/animals";

mongoose.Promise = global.Promise;

// Connect to MongoDB
// Source code copied from Lab 3 Exercise 2
try {
  connection = mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    checkServerIdentity: false,
  });
  console.log("connection to mongodb worked!");
} catch (e) {
  console.log("error in db connection: " + e.message);
}

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
console.log("db connection successful");
