const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const { Script } = require('vm');
const Repository = require('./repository');

 //promisify takes orginal callback based function and turns it into a promise and then we can use combine its use with await
const scrypt = util.promisify(crypto.scrypt)

class UsersRepository extends Repository{
    async create(attrs){
        //attrs === {email:'',password:''}
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password,salt,64);

        const records = await this.getAll();
        const record = {
            ...attrs, //get all properties of attrs and then replace the password 
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);
        //write the updated 'records' array back to this.filename
        await this.writeAll(records);
        return record;

    }

    async comparePassword(saved,supplied){
        //Saved -> password saved in our database.'hashed.salt'
        //Supplied -> password give to us by a user trying to sign in 

        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1]

        // above three lines can be written as 
        const [hashed,salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied,salt,64);

        return hashed === hashedSuppliedBuf.toString('hex')
    }
}

//test function

// const test = async()=>{
//     const repo = new UsersRepository('users.json');
//     await repo.create({email:'test@test2.com',password:'password2'});
//     //const users= await repo.getAll();
//     //const user = await repo.getOne('65a14475')
//     //console.log(user);
//    // await repo.delete('65a14475')
//    //await repo.create({email:'test@test.com'});
//    //await repo.update('ea97eecb',{DOB: '07/26/1998'});
//    const user = await repo.getOneBy({email:'test@test2.com'});
//    console.log(user)
// };

//  test();

//making code available to other files in the project, first way
// module.exports = UserRepository;

//ANOTHER FILE
// const UserRepository = require('./users');
// //pass in name of file to constructor -- if name of file is entered incorrectly cause bugs!
// const repo = new UsersRepository('users.json');

//better way, export an instance of the class
module.exports = new UsersRepository('users.json');

//using second way in another file we would just need to the following to call the file
// const repo = require('./users');
//can now call all the methods in the class
// repo.getAll();
// get.getOne();
