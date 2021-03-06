const express = require('express');
const bodyParser = require('body-parser'); //existing library similar to bodyparser that we created to act as middlewear to read form data
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

const app = express();

//whenever a request to a url is made, express will look inside the public folder first
app.use(express.static('public'));
//body parser will be applied globally to all route handler requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
    keys: ['sadfasfd807dfg']
})
);
//add this line to use router
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, ()=> {
    console.log('Listening');
});