var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//载入session中间件
var session = require('express-session');

var index = require('./routes/home/index');
var user = require('./routes/admin/user');

//引入自定义模块
var article = require('./routes/admin/posts.js');
var cats = require('./routes/admin/cats.js');
var admin=require('./routes/admin/index.js');



//引入五个分类页
var webtool=require('./routes/home/webtool.js');
var HTML5=require('./routes/home/HTML5.js');
var CSS3=require('./routes/home/CSS3.js');
var JavaScript=require('./routes/home/JavaScript.js');
var webnote=require('./routes/home/webnote.js');



// var login=require('./routes/admin/login.js');
//前台文章详情posts页面引入
var posts = require('./routes/home/posts.js');

var app = express();

//使用session中间件
app.use(session({
	secret: 'blog',
  	resave: false,
  	saveUninitialized: true,
  	cookie: {}
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//将后台的views/admin目录也进行静态托管
app.use(express.static(path.join(__dirname, 'views/admin')));

app.use('/', index);
// app.use('/users', users);


//针对/posts的请求，交给posts中间件处理//前台文章详情posts页面显示
app.use('/posts', posts);



//处理这五个分类请求
app.use('/webtool',webtool);
app.use('/HTML5',HTML5);
app.use('/CSS3',CSS3);
app.use('/JavaScript',JavaScript);
app.use('/webnote',webnote);



//针对后台的请求,都先经过checklogin
app.use("/admin", checkLogin);
app.use('/admin',admin);
//针对后台admin/posts的请求，交给article来处理（添加删除文章模块）
app.use('/admin/posts',article);
//针对后台admin/cats的请求，交给cats来处理（添加删除显示模块）
app.use('/admin/cats',cats);



//针对/admin/user/*的请求，交给user来处理，此处不要使用checkLogin
app.use('/user', user);
//自定义一个中间件，用于判断用户是否已经登录
function checkLogin(req,res,next) {
	//只需要判断session中是否有登录的标识
	if (!req.session.isLogin) {
		//没有登录，跳转到登录页面
		res.redirect('/user/login');
		return;
	}
	//否则就是已经登录，继续执行后续的代码
	next();
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
