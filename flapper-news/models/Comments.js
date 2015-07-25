/* require libraries */
var mongoose = require('mongoose');

/* setup the mongoose schema */
var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    upvotes: {
        type: Number,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

/* define the model and pass the mongoose schema */
mongoose.model('Comment', CommentSchema);
