var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    date: Date
});

var Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;