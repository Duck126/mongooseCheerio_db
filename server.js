//Dependencies (Axios - optional replacement for request).
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");

//Port
var PORT = 3001;

//Setup app to use express
var app = express();

//Database
var dbUrl = "newsScrape";

var collections = ["article", "comments", "users"];

app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/newsScrape");

var scrape_db = mongojs(dbUrl, collections);
scrape_db.on("error", function (req, res) {
    console.log("DB Error", error);
});

//Route to pull from article collection.
app.get("/news", function (req, res) {
    scrape_db.article.find({}, function(error, news) {
        if(error) {
            console.log(error);
        } else {
            res.json(news);
        }
    });
});

//Route to recieve new data.
app.get("/getnews", function (req, res) {
    //Request for coindesk html with cheerios & request.
    request("https://www.coindesk.com/", function (error, response, html) {
        var $ = cheerio.load(html);

        //Select element with information that you want.
        $(".article").each(function (i, element) {

            //Selectors for Elements nested inside each article.
            let photo = $(element).find("div.picture");
            let postInfo = $(element).find("div.post-info");
            let timeauthor = $(element).find("p.timeauthor");
            let titleDiv = $(element).find("h3");

            //Specify information with Selectors.
            var author = $(timeauthor).children("cite").text();
            var date = $(timeauthor).children("time").attr("datetime");
            var link = $(photo).children("a").attr("href");
            var title = $(titleDiv).children("a.fade").text();
            var story = $(postInfo).children("p").text();

            //Recieved data placed into an object.
            var scrapeData = {
                adate: date,
                aauthor: author,
                atitle: title,
                astory: story,
                alink: link
            };
            //Query to insert into our article collection.
            if (scrapeData) {
                scrape_db.article.insert({
                    link: scrapeData.alink,
                    title: scrapeData.atitle,
                    story: scrapeData.astory,
                    date: scrapeData.adate,
                    author: scrapeData.aauthor
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

//App listening on PORT: 3001.
app.listen(3001, function () {
    console.log("App is up on port " + PORT);
});