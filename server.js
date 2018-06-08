var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");

var PORT = 3001;

// Adds models to the app for Database.
var db = require("./models");

var app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/newsappdb");

var dbUrl = "newsScrape";

var collections = ["scrapedNews", "scrapedlinks"];

var scrape_db = mongojs(dbUrl, collections);
scrape_db.on("error", function (req, res) {
    console.log("DB Error", error);
});

app.get("/", function (req, res) {
    res.send("Hello Yall");
});

app.get("/getnews", function (req, res) {
    console.log("here")
    request("https://www.coindesk.com/", function (error, response, html) {
        var $ = cheerio.load(html);
 
        $(".article").each(function (i, element) {

            let photo = $(element).find("div.picture");
            var link = $(photo).children("a").attr("href");
            var image = $(photo).children("img").attr("src");

            let postInfo = $(element).find("div.post-info").text();
            var title = $(postInfo).children("p.timeauthor").text();
            var dateTime = $(postInfo).children("time").text();
            var author = $(postInfo).children(".author").text();
            var story = $(postInfo).children("p").text();

            var scrapeData = {
                atitle: title,
                adateTime: dateTime,
                aauthor: author,
                astory: story,
                alink: link,
                aimage: image
            };
            console.log(scrapeData);
            if (scrapeData) {
                scrape_db.scrapedNews.insert({
                    link: scrapeData.alink,
                    image: scrapeData.aimage,
                    title: scrapeData.atitle,
                    date: scrapeData.adateTime,
                    author: scrapeData.aauthor,
                    story: scrapeData.astory
                }, function (err, inserted) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log(inserted);
                    }
                });
            }
        });
    });
    res.send("Scrape Complete");
});


app.listen(3001, function () {
    console.log("App is up on port " + PORT);
});