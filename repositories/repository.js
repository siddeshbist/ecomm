const fs = require('fs');
const crypto = require('crypto')

module.exports = class Repository{
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