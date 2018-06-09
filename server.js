//Dependencies (Axios - optional replacement for request).
var express = require("express");
var mongojs = require("mongojs");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var logger = require("morgan");
var exphbs = require("express-handlebars");
//var axios = require("axios");

//Port
var PORT = process.env.PORT || 3001;

//Setup app to use express
var app = express();

//Database
var dbUrl = "newsScrape";
app.use(express.static(__dirname + "/public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Collections
var collections = ["article", "comment", "users"];

app.use(logger("dev"));

app.use(bodyParser.urlencoded({
    extended: true
}));

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.Promise = Promise;

//mongoose.connect("mongodb://localhost/newsScrape");

mongoose.connect(MONGODB_URI);

var scrape_db = mongojs(MONGODB_URI, collections);
scrape_db.on("error", function (req, res, error) {
    console.log("DB Error", error);
});

app.get("/", function(req, res){
    res.render("index");
});

//Route to create/update comment on article.
app.post("/article/:id", function (req, res) {
    console.log(req.body);
    var newcomment = {
        comment: req.body.comm,
        relationId: req.body.artId
    };
    scrape_db.comment.insert(newcomment, function (error, usercomment) {
        if (error) {
            console.log(error);
        } else {
            res.json(usercomment);
        }
    });
});

//Route to creat/update comment on article.
app.get("/articles/:id", function (req, res) {
    console.log(req);
    scrape_db.article.find({'relationId': req.params.id}).populate("comment").then(function (currentArticle) {
        console.log(currentArticle);
        res.json(currentArticle);
    }).catch(function (err) {
        res.json(err);
    });
});

//Route to pull from article collection.
app.get("/news", function (req, res) {
    scrape_db.article.find({}, function (error, news) {
        if (error) {
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
app.listen( PORT, function () {
    console.log("App is up on port " + PORT);
});