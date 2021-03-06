var mongoose = require("mongoose");

var articleSchema = new mongoose.Schema({
    heading: String,
    description: String,
    date: Date,
    url: {
        type: String,
        unique: true
    },
    img_url: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var Article = mongoose.model("Article", articleSchema);

module.exports = Article;