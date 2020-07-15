/* get libraries */
var mongoose = require('mongoose');

/* set up the mongoose schema */
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

/* set up the upvote method */
CommentSchema.methods.upvote = function (cb) {
	this.votes += 1;
	this.save(cb);
};

/* set up the downvote method */
CommentSchema.methods.downvote = function (cb) {
	this.votes -= 1;
	this.save(cb);
}

/* declare the model and pass the schema */
mongoose.model('Comment', CommentSchema);
