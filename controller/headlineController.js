const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

//Scraping tools
const cheerio = require("cheerio");
const axios = require("axios");

// var results = [];
var db = require("../model");
router.get("/", function (req, res) {
    db.Article.find().then(function(dbArticle) {
        res.render("index", {result: dbArticle});
    });
    
});

router.get("/scrape", function (req, res) {
    axios.get("https://www.statesman.com/").then(function(response) {
        var $ = cheerio.load(response.data)

        $("article").each((i, element) => {
            var result = {};
            // result.title = $(element).children("a").text("title");
            if (($(element).find("h3").find("a").text()) !== undefined) {
                result.title = $(element).find("h3").find("a").text().trim()
            }
            if (($(element).find("h3").find("a").attr("href")) !== undefined) {
                result.link = $(element).find("h3").find("a").attr("href");
            }
            // result.link = $(element).children("a").attr("href");

            console.log("result.title: ", result.title);
            console.log("result.link: ", result.link)

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