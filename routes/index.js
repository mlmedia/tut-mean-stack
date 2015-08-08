/* get libraries */
var mongoose = require('mongoose');
var express = require('express');
var passport = require('passport');

/* set the express router object */
var router = express.Router();

/* import the mongoose models */
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');
var User = mongoose.model('User');

/* GET home page */
router.get('/', function(req, res)
{
    /* response = render the index template */
    res.render('index');
});

/* GET posts index page */
router.get('/posts', function(req, res, next)
{
    Post.find(function(err, posts)
    {
        /* if an error, return */
        if(err)
        {
            return next(err);
        }

        /* json response */
        res.json(posts);
    });
});

/* POST to posts page */
router.post('/posts', function(req, res, next)
{
    /* setup a new post */
    var post = new Post(req.body);

    /* save a new post */
    post.save(function(err, post)
    {
        /* if an error, return */
        if(err)
        {
            return next(err);
        }

        /* json response */
        res.json(post);
    });
});

/* router param for the post */
router.param('post', function(req, res, next, id)
{
    var query = Post.findById(id);
    query.exec(function (err, post)
    {
        /* if an error, return */
        if (err)
        {
            return next(err);
        }
        if (!post) {
            return next(new Error("can't find post"));
        }

        /* return post from request */
        req.post = post;
        return next();
    });
});

/* router param for the comment */
router.param('comment', function(req, res, next, id)
{
    var query = Comment.findById(id);
    query.exec(function (err, comment)
    {
        /* if an error, return */
        if (err)
        {
            return next(err);
        }
        if (!comment)
        {
            return next(new Error("can't find comment"));
        }

        /* return comment from request */
        req.comment = comment;
        return next();
    });
});

/* GET post from ID */
router.get('/posts/:post', function(req, res, next)
{
    /* populate comments from the post */
    req.post.populate('comments', function(err, post)
    {
        /* json response */
        res.json(post);
    });
});

/* PUT an upvote to the post */
router.put('/posts/:post/upvote', function(req, res, next)
{
    req.post.upvote(function(err, post)
    {
        /* if an error, return */
        if (err) {
            return next(err);
        }

        /* json response */
        res.json(post);
    });
});

/* PUT a downvote to the post */
router.put('/posts/:post/downvote', function(req, res, next)
{
    req.post.downvote(function(err, post)
    {
        /* if an error, return */
        if (err)
        {
            return next(err);
        }

        /* json response */
        res.json(post);
    });
});

/* POST a new comment */
router.post('/posts/:post/comments', function(req, res, next)
{
    var comment = new Comment(req.body);
    comment.post = req.post;

    /* save a comment to the post */
    comment.save(function(err, comment)
    {
        /* if an error, return */
        if(err)
        {
            return next(err);
        }

        /* push comment to post and save */
        req.post.comments.push(comment);
        req.post.save(function(err, post)
        {
            /* if an error, return */
            if(err)
            {
                return next(err);
            }

            /* json response */
            res.json(comment);
        });
    });
});

/* PUT an upvte to a comment */
router.put('/posts/:post/comments/:comment/upvote', function(req, res, next)
{
    req.comment.upvote(function(err, comment)
    {
        /* if an error, return */
        if (err)
        {
            return next(err);
        }

        /* json response */
        res.json(comment);
    });
});

/* PUT a downvote to a comment */
router.put('/posts/:post/comments/:comment/downvote', function(req, res, next)
{
    req.comment.downvote(function(err, comment)
    {
        /* if an error, return */
        if (err)
        {
            return next(err);
        }

        /* json response */
        res.json(comment);
    });
});

/* register page */
router.post('/register', function(req, res, next)
{
    /* if form fields are blank, return error */
    if(!req.body.username || !req.body.password)
    {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    /* setup user object */
    var user = new User();
    user.username = req.body.username;
    user.setPassword(req.body.password)

    /* save user with username and password */
    user.save(function(err)
    {
        if(err)
        {
            return next(err);
        }

        /* return json response */
        return res.json({
            token: user.generateJWT()
        });
    });
});

/* set up login page */
router.post('/login', function(req, res, next)
{
    /* if username or password is missing, return the error */
    if(!req.body.username || !req.body.password)
    {
        return res.status(400).json({
            message: 'Please fill out all fields'
        });
    }

    /* authenticate w/ passport (local strategy) */
    passport.authenticate('local', function(err, user, info)
    {
        /* if an error, return */
        if(err)
        {
            return next(err);
        }

        /* if user is available, return json response w/ web token */
        if(user)
        {
            return res.json({
                token: user.generateJWT()
            });
        }
        else /* else return the error response */
        {
            return res.status(401).json(info);
        }
    })(req, res, next);
});

/* export the router object to the app */
module.exports = router;
