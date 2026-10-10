// second lab program:
// question : user registration REST API using node.js, express.js and SQLite3, bcrypt, jsonwebtoken 
// how to setup sqlite3 in express.js :
// first we have to create a folder and open folder inside vscode
// create one main file like server.js
// open terminal and run below commands to install express.js and sqlite3
// npm init -y
// npm i express sqlite3 bcrypt jsonwebtoken
// inside server.js file, copy paste below code
// run server.js file by node server.js inside terminal
const sqlite3 = require("sqlite3")
const express = require("express")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const app = express()
app.use(express.json())

const conObj = new sqlite3.Database("users.db")

conObj.run(`CREATE TABLE IF NOT EXISTS users
           (id INTEGER PRIMARY KEY AUTOINCREMENT,
           username TEXT UNIQUE,
           password TEXT NOT NULL)
    `)

app.post("/register",async (req,res)=>{
    const {username,password} = req.body
    const hashPass = await bcrypt.hash(password,10)
    const insertQuery= `INSERT INTO users(username,password)
                        VALUES(?,?)`
    conObj.run(insertQuery,[username,hashPass],(err)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        res.status(200).send("user registered successfully")
    })
})

app.post("/login",(req,res)=>{
    const {username,password} = req.body
    const readUserQuery = `SELECT * FROM users WHERE username = ?`
    conObj.get(readUserQuery,[username],async (err,row)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        if(!row){
            return res.status(404).send("user not registered")
        }
        const match = await bcrypt.compare(password,row.password)
        if(!match){
            return res.status(500).send("user password not matched")
        }
        const jwtToken = jwt.sign({id:row.id,username:row.username},"noOneHack",{expiresIn:"1hr"})
        const message = "user loggedin"
        res.status(200).json({
            message,
            jwtToken
        })
    })
})

app.listen(3000,()=>{
    console.log("server is runing on 3000")
})