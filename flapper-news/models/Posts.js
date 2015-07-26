/* require libraries */
var mongoose = require('mongoose');

/* setup the mongoose schema */
var PostSchema = new mongoose.Schema({
    title: String,
    link: String,
    upvotes: {
        type: Number,
        default: 0
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }]
});

/* add the function to upvote */
PostSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

/* define the model and pass the mongoose schema */
mongoose.model('Post', PostSchema);
