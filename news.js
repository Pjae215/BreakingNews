// newyorker.js
// Scrapes The New Yorker website's Latest News section

var axios = require("axios");
var cheerio = require("cheerio");

function scrape(callback) {
    console.log("Scraping The New Yorker...");
    axios.get("https://www.newyorker.com/news")
        .then((response) => {
            console.log("Received " + response.status + " " + response.statusText);
            var html = response.data;

            // Parse html using Cheerio library
            var $ = cheerio.load(html);
            var articles = $("li.River__riverItem___3huWr");
            // list items under each section are labeled the same
            console.log("Found " + articles.length + " articles");

            var newsArticles = [];

            // Extract information about each article
            for (var i=0; i<articles.length; i++) {
                var article = $(articles.get(i));
                var heading = article.find("h4").text();
                var description = article.find("h5").text();
                var date = article.find("h6").text();
                var img_url = article.find("img").attr("src");
                var url = article.find("a.Link__link___3dWao").attr("href"); // links are labeled the same under each section


                var newsArticle = {
                    heading: heading,
                    description: description,
                    date: date,
                    url: url,
                    img_url: img_url,
                    comments: []
                };
                newsArticles.push(newsArticle);
            }

            callback(newsArticles);

        });
}

module.exports = {
    scrape: scrape
};