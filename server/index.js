// Import npm packages
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080; // Step 1

const uploadAPI = require('./api/uploadAPI');

require("dotenv").config();

// Step 2

mongoose.set("strictQuery", false);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected!!!!");
});

// Data parsing
app.use(express.json({ limit: "1000mb" }));
app.use(
  cors({
    allowedHeaders: ["sessionId", "Content-Type"],
    exposedHeaders: ["sessionId"],
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
  })
);

app.use(express.urlencoded({ limit: "1000mb", extended: false }));

// Step 3
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// HTTP request logger
app.use(morgan("tiny"));

app.use("/uploadAPI", uploadAPI);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
