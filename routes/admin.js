var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest : './public/images/portfolio'});
var expressValidator = require('express-validator');
var mysql = require('mysql');
var session = require('express-session');
var connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : '123456',
  database : 'portfolio'

});

connection.connect();

router.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
})); 

router.use(require('connect-flash')());
router.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
router.use(session({
  secret : 'secret',
  saveUninitialized : true,
  resave : true
}));
/* GET users listing. */
router.get('/', function(req, res, next) {
  connection.query("SELECT * FROM projects", function(err, rows, fields){
    if(err) throw err;
    res.render('admin/index', {projects:rows});
  });
});

router.get('/add', function(req, res, next) {
  res.render('admin/add');
});



router.post('/add', upload.single('projectimage'), function(req, res, next) {
  var title = req.body.title;
  var description = req.body.description;
  var service = req.body.service;
  var client = req.body.client;
  var projecturl = req.body.projecturl;
  var projectdate = req.body.projectdate;

  
  if(req.file){
    var projectImageName = req.file.filename;
  }
  else{
    var projectImageName = "noImage.jpg";
  }
  
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('service', 'Service field is required').notEmpty();

  var errors = req.validationErrors();
  if(errors){
    res.render('admin/add',{
      errors : errors,
      title : title,
      description : description,
      service : service,
      client : client
    })
  }else{
    var project = {
      title : title,
      description : description,
      service : service,
      client : client,
      url : projecturl,
      date : projectdate,
      image : projectImageName
    };
  }
  
  var query = connection.query('INSERT INTO projects SET ?', project, function(err, result){
    console.log('Error: ' + err);
    console.log('Success: ' + result);
  });
  req.flash('success', 'Project Added');

  res.redirect('/admin');

});

router.get('/edit/:id', function(req, res, next){
  connection.query("SELECT * FROM projects WHERE id = ?", req.params.id, function(err, rows, fields){
    res.render('admin/edit', {project : rows[0]})
  });
});

router.post('/edit/:id', upload.single('projectimage'), function(req, res, next) {
  var title = req.body.title;
  var description = req.body.description;
  var service = req.body.service;
  var client = req.body.client;
  var projecturl = req.body.projecturl;
  var projectdate = req.body.projectdate;

  
  
  req.checkBody('title', 'Title field is required').notEmpty();
  req.checkBody('service', 'Service field is required').notEmpty();

  var errors = req.validationErrors();

  if(req.file){
    var projectImageName = req.file.filename;
  }
  else{
    var projectImageName = "noImage.jpg";
  }
  if(req.file){
    var projectImageName = req.file.filename;
    if(errors){
      res.render('admin/add',{
        errors : errors,
        title : title,
        description : description,
        service : service,
        client : client
      })
    }else{
      var project = {
        title : title,
        description : description,
        service : service,
        client : client,
        url : projecturl,
        date : projectdate,
        image : projectImageName
      };
    }
  }else{
    if(errors){
      res.render('admin/add',{
        errors : errors,
        title : title,
        description : description,
        service : service,
        client : client
      })
    }else{
      var project = {
        title : title,
        description : description,
        service : service,
        client : client,
        url : projecturl,
        date : projectdate,
      };
    }
  }

  var query = connection.query('UPDATE projects SET ? WHERE id ='+req.params.id, project, function(err, result){
    console.log('Error: ' + err);
    console.log('Success: ' + result);
  });
  req.flash('success', 'Project Edited');

  res.redirect('/admin');
});

module.exports = router;
