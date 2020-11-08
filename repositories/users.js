const fs = require('fs');
const crypto = require('crypto');

class UsersRepository{
    constructor(filename){
        if(!filename){
            throw new Error('Creating a repository requires a filename');
        }
        //store filename inside instance variable 
        this.filename = filename;
        //need to check if file exists in hardrive
        //use accessSync to check if file exists, does not use callbacks because not allowed to have async code in constructor and will only be creating user repository once
        //constructor cannot be asyn in JS so use accessSync
        try{
            fs.accessSync(this.filename);
        } catch(err){
            fs.writeFileSync(this.filename,'[]');
        }
        }  

        async getAll(){
            return JSON.parse (await fs.promises.readFile(this.filename,{encoding: 'utf-8'
        })
        );
        }

        async create(attrs){
            attrs.id = this.randomId();
            const records = await this.getAll();
            records.push(attrs);
            //write the updated 'records' array back to this.filename
            await this.writeAll(records);
            return attrs;

        }
        async writeAll(records){
            await fs.promises.writeFile(this.filename,JSON.stringify(records,null,2))
        }

        //creating random id using crypto library
        randomId(){
            return crypto.randomBytes(4).toString('hex')
        }

        async getOne(id){
            const records = await this.getAll();
            return records.find(record=> record.id === id);
        }
        //pass into this function the id of the record to delete
        async delete(id){
            const records = await this.getAll();
            const filteredRecords = records.filter(record=> record.id !== id);
            await this.writeAll(filteredRecords);
        }

        async update(id,attrs){
            const records = await this.getAll();
            const record = records.find(record=> record.id === id);

            if(!record){
                throw new Error('Record with id ${id} not found');
            }
            //record === {email:'test@test.com'}
            //attrs === {password: 'mypassword'}
            Object.assign(record,attrs);
            //record === {email:'test@test.com','password: 'mypassword'};
            await this.writeAll(records);
        }

        async getOneBy(filters){
            //get all the records
            const records = await this.getAll();

            for(let record of records){
                //use let as variable value will be changing
                let found = true;
                for(let key in filters){
                    if(record[key] !== filters[key]){
                        found = false;
                    }
                }
                if (found){
                    return record;
                }
            }
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
