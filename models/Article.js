const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
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

const Article = mongoose.model("Article", articleSchema);

module.exports = Article;