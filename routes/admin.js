var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin/index');
});

router.get('/add', function(req, res, next) {
  res.render('admin/add');
});

router.post('/add', function(req, res, next) {
  res.render('admin/add');
});

module.exports = router;
