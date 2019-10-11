var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var newyorker = require("./news");
var models = require("./models");
var logger = require("morgan");

var app = express();

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(logger("dev"));

// Handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Setup database
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// Connect to the Mongo DB
mongoose.connect(MONGODB_URI, {useNewUrlParser: true });
var Article = models.Article;
var Comment = models.Comment;


// Routes
app.get('/', (req, res) => {
    Article.find({}).sort({ date: -1 })
        .then((articles) => {
            res.render('index', {
                articles: articles
            })
        })
});


app.get('/articles/:id', (req, res) => {
    var id = req.params.id;
    Article.findById(id).populate("comments").exec()
        .then((article) => {
            res.render("more", article);
        });
});


app.post('/articles/:id/comments', (req, res) => {
    var articleId = req.params.id;
    var commentText = req.body.text;

    // Create a comment
    Comment.create({ text: commentText, date: new Date() })
        .then((comment) => {
            

            return Article.findByIdAndUpdate(articleId, { $push: { comments: comment._id } }, { new: true })
        })
        .then((article) => {
            res.redirect("/articles/" + articleId);
        })
});

app.delete('/articles/:articleId/comments/:commentId', (req, res) => {
    var articleId = req.params.articleId;
    var commentId = req.params.commentId;

    Article.findByIdAndUpdate(articleId, { $pull: { comments: commentId } })
        .then(() => {
            Comment.findByIdAndDelete(commentId)
                .then(() => res.sendStatus(200));
        })

});


app.post("/api/scrape", (req, res) => {
    newyorker.scrape(function (newsArticles) {

        // Add all news articles to MongoDB
        Article.insertMany(newsArticles, { ordered: false }, function (err, articles) {
            if (!err) {
                // All articles were inserted successfully
                console.log("Articles inserted: " + articles.length);
                res.json({ count: articles.length });
            }
            else if (err.result.ok) {
                // Some articles may have been duplicates
                console.log("Articles inserted: " + err.result.nInserted);
                res.json({ count: err.result.nInserted });
            }
            else {
                console.log(response);
                res.staus(500).json(response.result);
            }
        })
    });
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server listening at port " + PORT));