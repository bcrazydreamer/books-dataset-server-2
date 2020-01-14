const express        = require('express');
const app            = express();
const bodyParser     = require('body-parser');
const path           = require('path');
const morgan         = require('morgan');
const helmet         = require('helmet');
const compression    = require('compression');
const cors           = require('cors');
const bv             = require('bvalid');
const mongoose       = require('mongoose');
const Books          = require('./model/books.model');

const port = process.env.PORT || 3000;

require('./utils/db.util');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

//Security
app.use(helmet());

//Performance
app.use(compression());

//Cors
app.use(cors());


app.use(express.static(path.join(__dirname,"public")));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Credentials", "true");
    if ('OPTIONS' === req.method) {
      return res.status(200).end();
    }
    return next();
});

app.options("*",function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.status(200).end();
});

app.get('/', async function(req, res, next) {
  return res.status(200).json({status : true});
})

app.post('/', async function(req, res, next) {
  var data = req.body;
  var ob = {};
  var s = {};
  var limit = 500;
  var skip = 0;
  var prj = {};
  var sort = {};
  if(bv.isObject(data.sort)){
    sort = data.sort;
  } else {
    sort = {rating : -1};
  }
  var stk = data.strict === true || data.strict === "true" ? true : false;
  try{
    if(bv.isString(data.book) && data.book.trim().length > 0){
      s.title = stk ? new RegExp(data.book.trim(),"ig") : data.book.trim();
    }
    if(bv.isString(data.author) && data.author.trim().length > 0){
      s.authors = stk ? new RegExp(data.author.trim(),"ig") : data.author.trim(); 
    }
    if(bv.isString(data.id)){
     if(mongoose.Types.ObjectId.isValid(data.id.trim())){
         s._id = mongoose.Types.ObjectId(data.id.trim());
     } else {
         ob.success = false;
         ob.data = {};
         return res.status(400).json(ob);
     }
    }
    if(!isNaN(data.limit) && Number(data.limit) < 500){limit = Number(data.limit)}
    if(!isNaN(data.skip)){skip = Number(data.skip)}
    if(bv.isObject(data.prj)){prj = data.prj}
  }catch(err){}
  try{
    ob.success = true;
    ob.data = await Books.find(s,prj,{skip : skip,limit : limit,sort : sort});
  }catch(error){
    ob.success = false;
    ob.data = {};
    return res.status(500).json(ob);
  }
  return res.status(200).json(ob);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  if(err.message){
    var errMsg = err.message;
  }else{
    var errMsg = err;
  }
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.send(errMsg);
});

app.listen(port);
console.log('started application on port' + port);
exports = module.exports = app;
