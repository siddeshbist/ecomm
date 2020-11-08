const express = require('express');
const bodyParser = require('body-parser'); //existing library similar to bodyparser that we created to act as middlewear to read form data
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');


const app = express();

//body parser will be applied globally to all route handler requests
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieSession({
    keys: ['sadfasfd807dfg']
})
);

//second argument in route handler is a callback function 
app.get('/',(req,res) => {
    res.send(`
    <div>
    // http method assosciated with form is POST, info is in the request body not as query string like GET
        <form method='POST'>
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="confirm password"/>
            <button>Submit</button>
        </form>
    </div>
    `);
});

// //middleware function
// const bodyParser = (req,res,next) => {
//     if (req.method === 'POST'){
//         req.on('data',data=> {
//             const parsed = data.toString('utf8').split('&');
//             const formData = {};
//             for (let pair of parsed){
//                 const [key,value] = pair.split('=');
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//     } else {
//         next();
//     }
// }

//this route is activated when submit button is pressend on form as a post request is being sent to /
app.post('/',async(req,res)=>{
    //see contents of form data is in the incoming request
    // req.on('data',data =>{
    //     const parsed = data.toString('utf8').split('&');
            //const formData = {};
            //for(let pair of parsed){
                //const[key,value] = pair.split('=');
                //formData[key] = value;
            //}
            //console.log(formData);
    // });
    const {email,password,passwordConfirmation} = req.body;
    //to check if email aleady exists
    const existingUser = await usersRepo.getOneBy({email});
    if(existingUser){
        return res.send('Email is use');
    }

    if (password !== passwordConfirmation){
        return res.send("Passwords much match")
    }

    //Create a user in our user repo to represent this person
    const user = await usersRepo.create({email,password});

    //Store the id of that user inside the users cookie
    req.session.userId = user.id; // Added by cookie session




    res.send('Account Created');
    //console.log(req.body);
});

app.listen(3000, ()=> {
    console.log('Listening');
});