//module import, aisiteruuuuuuuuuuuu
var express = require('express');
var http = require('http');
var static = require('serve-static');
var path = require('path');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// variable app delceard using express function(var express)
var app = express(); 

//set port env, or 3000
app.set('port', process.env.PORT || 3000); 

// path set using path function(var path)
app.use('/public', static(path.join(__dirname, 'public')));

//set body-parser as middleware
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

//set cookieparser as middleware
app.use(cookieParser());

//set expressSession as middleware, it contained information from session object
app.use(expressSession({
    secret: 'my key',
    resave: true,
    saveUninitialized: true
}));

// router decleared
var router = express.Router();

// when requesting process/login route, respond log and got ID/Password
router.route('/process/login').post(function(req,res){
    console.log('/process/login functin called');
    var paramID = req.body.id||req.query.id;
    var paramPassword = req.body.password||req.query.password;
    if(req.session.user)
        {
            console.log('you already login here! come and join here bro :)');
            res.redirect('/public/product.html');
        }
    else
    {
        req.session.user = {
            id : 'paramID',
            name : 'hello',
            authorized : true
        }
    };
    res.writeHead('200',{'Content-type':'text/html;charset=utf8'});
    res.write('<h1>login succesful!!!</h1>');
    res.write('<div><p>param id: '+ paramID +'</p></div>');
    res.write('<div><p>param password: '+paramPassword+'</p></div>');
    res.write("<br><br><a href='/process/product'> go to product platfrom </a>");
    res.end();
});

// when requesting process/logout route, respond log and got ID/Password
router.route('/process/logout').get(function(req,res){
    console.log('/process/logout functin called');
    if(req.session.user)
        {
            console.log('logout bye bro :)');
            req.session.destroy(function(err)
                               {
                if (err)
                    throw err;
                console.log('destory session and log out succesful');
                res.redirect('/public/login.html');
            });
        }
    else
    {
        console.log('not login yet');
        res.redirect('/public/login.html');
    }
});

// when requesting process/setUserCookie route, respond log and got cookie, saved, redirect showCookie
router.route('/process/setUserCookie').get(function(req, res){
   console.log('/process/setUserCookie function called ');
    res.cookie('user', {
        id : 'hello',
        name : 'hola',
        authorized : true
    });
    res.redirect('/process/showCookie');
});

//when requesting process/showCookie route, respond log and requesing cookie outprint
router.route('/process/showCookie').get(function(req, res){
    console.log('/process/showCookie function called');
    res.send(req.cookies);
});

// when requesting process/product route, respond log and if session has value, redirect product.html. if not redirect to login.html
router.route('/process/product').get(function(req, res){
    console.log('/process/product functin called');
    if(req.session.user)
        {
            res.redirect('/public/product.html');
        }
    else{
        res.redirect('/public/login.html');
    }
});

// use router as middleware, that could route path given '/'
app.use('/', router);

// error handling function, module importing, use it as middleware when httperror 404 happened, outprint 404.html
var expressErrorHandler = require('express-error-handler');
app.use(expressErrorHandler.httpError(404));

// making errorHandler function
var errorHandler = expressErrorHandler(
{
    static:
    {
        '404': './public/404.html'
    }
});

//ues errorHandler as middleware
app.use(errorHandler);

// server function, ues app struct 'port' num(if would be contain env port or 3000)
var server = http.createServer(app).listen(app.get('port'), function(){
   console.log('express web server port : '+ app.get('port')); 
});