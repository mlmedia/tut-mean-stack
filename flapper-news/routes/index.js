/* require libraries */
var express = require('express');
var mongoose = require('mongoose');

/* set vars / objects */
var router = express.Router();
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page */
router.get('/', function(req, res, next)
{
    res.render('index',
    {
        title: 'Express'
    });
});

/* GET posts page */
router.get('/posts', function(req, res, next)
{
    Post.find(function(err, posts)
    {
        if(err)
        {
            return next(err);
        }
        res.json(posts);
    });
});

/* POST new post */
router.post('/posts', function(req, res, next)
{
    var post = new Post(req.body);
    post.save(function(err, post)
    {
        if(err)
        {
            return next(err);
        }
        res.json(post);
    });
});

/* creating a param for preloading post objects */
router.param('post', function(req, res, next, id)
{
    var query = Post.findById(id);
    query.exec(function (err, post)
    {
        if (err)
        {
            return next(err);
        }
        if (!post) {
            return next(new Error("can't find post"));
        }
        req.post = post;
        return next();
    });
});

/* GET a single post */
router.get('/posts/:post', function(req, res)
{
    res.json(req.post);
});

/* PUT upvotes to a post */
router.put('/posts/:post/upvote', function(req, res, next)
{
    req.post.upvote(function(err, post)
    {
        if (err) {
            return next(err);
        }
        res.json(post);
    });
});

/* export the router */
module.exports = router;
