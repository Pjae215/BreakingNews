// newyorker.js
// Scrapes The New Yorker website's Latest News section

const axios = require("axios");
const cheerio = require("cheerio");

function scrape(callback) {
    console.log("Scraping The New Yorker...");
    axios.get("https://www.newyorker.com/latest/news")
        .then((response) => {
            console.log("Received " + response.status + " " + response.statusText);
            const html = response.data;

            // Parse html using Cheerio library
            const $ = cheerio.load(html);
            const articles = $("li.River__riverItem___3huWr");
            console.log("Found " + articles.length + " articles");

            var newsArticles = [];

            // Extract information about each article
            for (var i=0; i<articles.length; i++) {
                var article = $(articles.get(i));
                var heading = article.find("h4").text();
                var description = article.find("h5").text();
                var date = article.find("h6").text();
                var img_url = article.find("img").attr("src");
                var url = article.find("a.Link__link___3dWao").attr("href");

                // console.log("----------");
                // console.log("Heading: " + heading);
                // console.log("Description; " + description);
                // console.log("Date: " + date);
                // console.log("URL: https://www.newyorker.com" + url);
                // console.log("Image URL: " + img_url);

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