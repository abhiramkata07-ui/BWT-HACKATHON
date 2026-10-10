const sqlite3 = require("sqlite3")

const conObj = new sqlite3.Database("./students.db",(err)=>{
    if(err){
        console.log(err.message)
    }
    else{
        console.log("database connection built successfully")
    }
})

module.exports = conObj