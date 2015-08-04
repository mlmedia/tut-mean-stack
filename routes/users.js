/* get libraries */
var express = require('express');

/* set the express router object */
var router = express.Router();

/* GET users listing */
router.get('/', function(req, res)
{
    res.send('respond with a resource');
});

/* export the router object to the app */
module.exports = router;
