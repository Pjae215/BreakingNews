const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    text: String,
    date: Date
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;