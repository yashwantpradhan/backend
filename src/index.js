const mongoose= require("mongoose")

const express=require("express")
const app=express()
const path=require("path")
const hbs=require("hbs")
const exp = require("constants")
const collection=require("./mongodb")  //structure of db 
const templatePath=path.join(__dirname,'../templates')
const db = "mongodb://localhost:27017/Login_Data";


mongoose.connect(db,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useUnifiedTopology:true,
    useFindandModify:false
}).then(()=>{
    console.log("connection successful");
}).catch ((err)=>console.log("no connection"));

app.use(express.json())
app.set("view engine","hbs")
app.set("views",templatePath)
app.use(express.urlencoded({extended:false}))

app.get("/",(req,res)=>{
    res.render("login")
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})


// app.post("/signup",async (req,res)=>{

// })
app.post("/signup", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        // Check if the user already exists
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already exists");
        }

        // Create a new user
        const user = new collection({
            username,
            email,
            password
        });

        // Save the user to the database
        await user.save();

        res.status(201).send("User registered successfully");
    } catch (error) {
        console.error("Error during user signup:", error);
        res.status(500).send("Internal Server Error");
    }
});




app.listen(3000,()=>{
    console.log("port connected");
})