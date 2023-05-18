var mongoose = require("mongoose");

var mongoDB = `mongodb://${process.env.MONGO_URL}:${process.env.MONGO_PORT}`;

mongoose.Promise = global.Promise;

// Connect to MongoDB
// Source code copied from Lab 3 Exercise 2
try {
  connection = mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    checkServerIdentity: false,
  });
  console.log(`MongoDB connection established: ${mongoDB}`);
} catch (e) {
  console.log("error in db connection: " + e.message);
}

var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
