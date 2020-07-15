/* get libraries */
var mongoose = require('mongoose');

/* set up the mongoose schema */
var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
	votes: {
		type: Number,
		default: 0
	},
	comments: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Comment'
    }]
});

/* set up the upvote method */
PostSchema.methods.upvote = function (cb) {
	this.votes += 1;
	this.save(cb);
};

/* set up the downvote method */
PostSchema.methods.downvote = function (cb) {
	this.votes -= 1;
	this.save(cb);
}

/* declare the model and pass the schema */
mongoose.model('Post', PostSchema);
