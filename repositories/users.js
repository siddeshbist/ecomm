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

    }

const test = async()=>{
    const repo = new UsersRepository('users.json');
    //await repo.create({email:'test@test.com',password:'password'});
    //const users= await repo.getAll();
    //const user = await repo.getOne('65a14475')
    //console.log(user);
    await repo.delete('65a14475')
};

test();


    


const repo = new UsersRepository('users.json');
