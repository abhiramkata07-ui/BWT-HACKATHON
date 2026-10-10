// <!-- first lab program, CRUD operations on student using express.js, sqlite3

//how to setup sqlite3 in express.js :
//first we have to create a folder and open folder inside vscode
//create one main file like server.js
//open terminal and run below commands to install express.js and sqlite3
//npm init -y
//npm i express sqlite3
//first we need to create database connection object, for that we have to create database.js file inside newly create folder: -->
const { get } = require("node:http")
const conObj = require("./database")
const express = require("express")
const app = express()
app.use(express.json())

conObj.run(`CREATE TABLE IF NOT EXISTS students
    (
     id INTEGER PRIMARY KEY AUTOINCREMENT,
     name TEXT NOT NULL,
     branch TEXT NOT NULL,
     email TEXT UNIQUE
    )
    `)

app.post("/register-student",(req,res)=>{
    const {name,branch,email}=req.body

    const insertQuery = `INSERT INTO students(name,branch,email)
                         VALUES(?,?,?)`
    conObj.run(insertQuery,[name,branch,email],(err)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        res.status(201).send("student registered successfully")
    })
})

app.get("/get-all-students",(req,res)=>{
    conObj.all(`SELECT * FROM students`,[],(err,rows)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        res.status(200).json(rows)
    })
})

app.get("/get-specific-student/:id",(req,res)=>{
    const getStudentQuery = `SELECT * FROM students 
                        WHERE id = ?`

    conObj.get(getStudentQuery,[req.params.id],(err,row)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        res.status(200).json(row)
    })
})

app.delete("/delete-student/:id",(req,res)=>{
    const deleteQuery = `DELETE FROM students WHERE id = ?`
    conObj.run(deleteQuery,[req.params.id],(err)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        res.status(200).send("deleted student successfully")
    })
})

app.put("/update-student/:id",(req,res)=>{
    const {name,branch,email}=req.body

    const updateQuery = `UPDATE students 
                         SET name = ?, branch = ?, email = ?
                         WHERE id = ?
                         `
    conObj.run(updateQuery,[name,branch,email,req.params.id],(err)=>{
        if(err){
            return res.status(500).send(err.message)
        }
        res.status(200).send("student updated successfully")
    })
})

app.listen(3000,()=>{
    console.log("server is runing on 3000")
})