//third lab program:
//question : student CRUD REST API using node.js, express.js and mongoose
//first we have to create a folder and open folder inside vscode
//create one main file like server.js
//open terminal and run below commands to install express.js and mongoose
//npm init -y
//npm i express mongoose
//inside server.js file, copy paste below code
//run server.js file by node server.js inside terminal

const mongoose = require("mongoose")
const express = require("express")
const app = express()
app.use(express.json())

mongoose.connect("mongodb://127.0.0.1:27017/studentsDB")
.then(()=>{
    console.log("mongodb connected")
})
.catch((err)=>{
    console.log(err.message)
})

const studentSchema = mongoose.Schema(
    {
        name:String,
        age:Number,
        branch:String
    }
)

const Student = mongoose.model("Student",studentSchema)

app.post("/register",async(req,res)=>{
    const studentData = req.body
    const student = new Student(studentData)
    await student.save()
    res.status(201).send("student registered")
})

app.get("/get-students",async(req,res)=>{
    try{
        const students = await Student.find()
        res.status(200).json(students)
    }
    catch(err){
        res.status(500).send(err.message)
    }
})
app.get("/student/:id",async(req,res)=>{
    try{
      const stu = await Student.findById(req.params.id)
      res.status(200).json(stu)
    }
    catch(err){
        res.status(500).send(err.message)
    }
})
app.delete("/delete/:id",async(req,res)=>{
    try{
      await Student.findByIdAndDelete(req.params.id)
      res.status(200).send("student deleted successfully")
    }
    catch(err){
        res.status(500).send(err.message)
    }
})

app.put("/update/:id",async(req,res)=>{
    try{
      const updateDetails = req.body
      await Student.findByIdAndUpdate(req.params.id,updateDetails)
      res.status(200).send("student updated successfully")
    }
    catch(err){
        res.status(500).send(err.message)
    }
})

app.listen(3000,()=>{
    console.log("server is running on 3000")
})