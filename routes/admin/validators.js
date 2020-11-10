//create validation chains and export them so they can be referenced by other files
const {check} = require('express-validator')
const usersRepo = require('../../repositories/users')

module.exports = {
    requireEmail: check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) =>{
        const existingUser = await usersRepo.getOneBy({email});
        if(existingUser){
            throw new Error('email in use')
        }
    }),
    requirePassword: check('password').trim().isLength({min:4,max:20}).withMessage('Must be between 4 and 20 characters'),
    requirePasswordConfirmation: check('passwordConfirmation')
    .trim()
    .isLength({min:4,max:20})
    .withMessage('Must be between 4 and 20 characters')
    //{req} contains password
    .custom((passwordConfirmation,{req}) => {
        if(passwordConfirmation !== req.body.password){
            throw new Error('Passwords must match')
        }
    }),
    requireEmailExists:     check('email')
    .trim().normalizeEmail().isEmail().withMessage('Must provide a valid email')
    .custom(async (email) => {
        const user = await usersRepo.getOneBy({email:email})
        if(!user){
            throw new Error("email not found");
        }
    }),
    requireValidPasswordForUser: check('password')
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
};
