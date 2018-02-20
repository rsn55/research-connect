var express = require('express');
var router = express.Router();

//localhost:3001/lab goes here
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

//   localhost:3001/lab/get
router.get('/get')

module.exports = router;

//localhost:3001/lab/register
router.post("/register", function (req, res) {
});