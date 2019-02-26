// Dependancies
const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const logger = require("morgan");

const app = express();

// var databaseUrl = "scraper";
// var collections = ["scrapedData"];

var db = require("./model/");

const PORT = process.env.PORT || 3000;
app.engine("handlebars", exphbs({ defaultLayout: "main"}));
app.set("view engine", "handlebars");

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(__dirname + "/public"));

const router = require("./controller/headlineController")
app.use(router);

//Connect to Mongo
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongooseScraper";

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, (error) => {
    if (error) {
        console.log(error)
    } else {
        console.log("mongoose connected")
    }
});

app.listen(PORT, () => console.log("App running on port " + PORT + "!"));