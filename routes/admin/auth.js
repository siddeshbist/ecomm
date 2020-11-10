const express = require('express');
const usersRepo = require('../../repositories/users');

const router = express.Router();

router.get('/signup',(req,res) => {
    res.send(`
    <div>
        Your ID is: ${req.session.userId}
        <form method='POST'>
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <input name="passwordConfirmation" placeholder="confirm password"/>
            <button>Submit</button>
        </form>
    </div>
    `);
});

router.post('/signup',async(req,res)=>{
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


router.get('/signout',(req,res)=>{
    req.session = null;
    res.send('You are logged out')
});

router.get('/signin',(req,res) =>{
    res.send(`<div>
        <form method='POST'>
            <input name="email" placeholder="email"/>
            <input name="password" placeholder="password"/>
            <button>Sign In</button>
        </form>
    </div>
    `);
});

router.post('/signin',async (req,res)=>{
    const{email,password} = req.body;
    const user = await usersRepo.getOneBy({email});

    if(!user){
        return res.send('Email not found');
    }

    const validPassword = await usersRepo.comparePassword(
        user.password,
        password
    );

    if(!validPassword){
        return res.send('Invalid password')
    }

    req.session.userId = user.id;

    res.send('You are signed in');
});

//export router to be used with other files in project

module.exports = router;