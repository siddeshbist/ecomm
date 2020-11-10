const express = require('express');
const {check,validationResult} = require('express-validator');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
//destructuring requireEmail object
const {requireEmail,requirePassword,requirePasswordConfirmation} = require('./validators');

const router = express.Router();

router.get('/signup',(req,res) => {
    res.send(signupTemplate({req}));
});

router.post('/signup',[
    requireEmail,
    requirePassword,requirePasswordConfirmation],
    async(req,res)=>{
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.send(signupTemplate({req,errors}));
        }
   
    const {email,password,passwordConfirmation} = req.body;
    //to check if email aleady exists




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
    res.send(signinTemplate());
});

router.post('/signin',[
    check('email')
    .trim().normalizeEmail().isEmail().withMessage('Must provide a valid email')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({email:email})
        if(!user){
            throw new Error("email not found");
        }
    }),
    check('password')
        .trim()
        .custom(async (password, {req})=>{
            const user = await usersRepo.getOneBy({email: req.body.email})
            if(!user){
                throw new Error('Invalid Password');
            }
            const validPassword = await usersRepo.comparePassword(
                user.password,
                password
            );
            if(!validPassword){
                throw new Error('Invalid Password');
            }
        })
],async (req,res)=>{
    const errors = validationResult(req);
    const{email} = req.body;
    const user = await usersRepo.getOneBy({email});

    req.session.userId = user.id;

    res.send('You are signed in');
});

//export router to be used with other files in project

module.exports = router;