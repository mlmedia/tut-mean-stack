/* require libraries */
var mongoose = require('mongoose');

/* setup the mongoose schema */
var CommentSchema = new mongoose.Schema({
    body: String,
    author: String,
    votes: {
        type: Number,
        default: 0
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }
});

/* set upvote method */
CommentSchema.methods.upvote = function(cb) {
    this.votes += 1;
    this.save(cb);
};

/* set downvote method */
CommentSchema.methods.downvote = function(cb) {
    this.votes -= 1;
    this.save(cb);
}

/* define the model and pass the mongoose schema */
mongoose.model('Comment', CommentSchema);
