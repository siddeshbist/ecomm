const express = require('express');
const bodyParser = require('body-parser'); //existing library similar to bodyparser that we created to act as middlewear to read form data
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth')

const app = express();

//body parser will be applied globally to all route handler requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
    keys: ['sadfasfd807dfg']
})
);
//add this line to use router
app.use(authRouter);

app.listen(3000, ()=> {
    console.log('Listening');
});