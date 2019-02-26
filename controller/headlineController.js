const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//Scraping tools
const cheerio = require("cheerio");
const axios = require("axios");

// var results = [];
var db = require("../model");
router.get("/", function (req, res) {
    res.render("index");
});

router.get("/scrape", function (req, res) {
    axios.get("https://www.marca.com/futbol.html").then(function(response) {
        var $ = cheerio.load(response.data)

        $("article").each((i, element) => {
            var result = {};
            result.title = $(element).children("a").text("title");
            result.link = $(element).children("a").attr("href");
            db.Article.create(result)
            .then((dbArticle) => console.log(dbArticle))
            .catch((err) => console.log(err));
        });
        res.send("Scrape Complete");
    });
    res.redirect("/");
});

router.get("/articles", function(req, res) {
    db.Article.find({}).then((dbArticle) => res.json(dbArticle)).catch((err) => res.json(err));
});

router.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id }).populate("note").then((dbArticle) => res.json(dbArticle)).catch((err) => res.json(err));
});

router.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then((dbNote) => db.Article.findOneAndUpdate({
        _id: req.params.id   
    }, {
        note: dbNote._id
    }, {
        new: true
    }))
    .then((dbArticle) => res.json(dbArticle))
    .catch((err) => res.json(err));
});

module.exports = router;