const fs = require('fs');

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
            const records = await this.getAll();
            records.push(attrs);
            //write the updated 'records' array back to this.filename
            await fs.promises.writeFile(this.filename,JSON.stringify(records))

        }
        async writeAll
    }

const test = async()=>{
    const repo = new UsersRepository('users.json');
    await repo.create({email:'test@test.com',password:'password'});
    const users= await repo.getAll();
    console.log(users);
};

test();


    


const repo = new UsersRepository('users.json');
