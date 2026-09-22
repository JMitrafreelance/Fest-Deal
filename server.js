import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

dotenv.config();
const app=express();
app.use(cors({origin:true}));
app.use(express.json({limit:"1mb"}));

const productSchema=new mongoose.Schema({
 name:{type:String,required:true},category:{type:String,required:true},price:Number,oldPrice:Number,
 image:String,rating:Number,amazonUrl:{type:String,required:true},description:String
},{timestamps:true});
const postSchema=new mongoose.Schema({title:{type:String,required:true},slug:{type:String,required:true,unique:true},content:{type:String,required:true}},{timestamps:true});
const adminSchema=new mongoose.Schema({username:{type:String,unique:true},passwordHash:String});
const Product=mongoose.model("Product",productSchema);
const Post=mongoose.model("Post",postSchema);
const Admin=mongoose.model("Admin",adminSchema);

function auth(req,res,next){
 const h=req.headers.authorization||"";
 const token=h.startsWith("Bearer ")?h.slice(7):"";
 try{req.admin=jwt.verify(token,process.env.JWT_SECRET);next()}catch{res.status(401).json({message:"Unauthorized"})}
}
app.get("/api/health",(req,res)=>res.json({ok:true,service:"Dealzy API"}));
app.get("/api/products",async(req,res)=>res.json(await Product.find().sort({createdAt:-1})));
app.get("/api/posts",async(req,res)=>res.json(await Post.find().sort({updatedAt:-1})));

app.post("/api/auth/login",async(req,res)=>{
 const {username,password}=req.body;
 const admin=await Admin.findOne({username});
 if(!admin || !(await bcrypt.compare(password,admin.passwordHash))) return res.status(401).json({message:"Invalid username or password"});
 const token=jwt.sign({id:admin._id,username:admin.username},process.env.JWT_SECRET,{expiresIn:"7d"});
 res.json({token});
});

app.post("/api/products",auth,async(req,res)=>res.status(201).json(await Product.create(req.body)));
app.put("/api/products/:id",auth,async(req,res)=>res.json(await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})));
app.delete("/api/products/:id",auth,async(req,res)=>{await Product.findByIdAndDelete(req.params.id);res.json({ok:true})});

app.post("/api/posts",auth,async(req,res)=>res.status(201).json(await Post.create(req.body)));
app.put("/api/posts/:id",auth,async(req,res)=>res.json(await Post.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})));
app.delete("/api/posts/:id",auth,async(req,res)=>{await Post.findByIdAndDelete(req.params.id);res.json({ok:true})});

async function seedAdmin(){
 const username=process.env.ADMIN_USERNAME||"Admin";
 const password=process.env.ADMIN_PASSWORD||"Ecom12@";
 let admin=await Admin.findOne({username});
 if(!admin){admin=await Admin.create({username,passwordHash:await bcrypt.hash(password,12)});console.log("Admin account created:",username);}
}
const port=process.env.PORT||10000;
mongoose.connect(process.env.MONGODB_URI).then(async()=>{await seedAdmin();app.listen(port,()=>console.log("Dealzy API running on",port));}).catch(err=>{console.error("MongoDB connection failed:",err);process.exit(1);});
const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`Server running on port ${PORT}`);
});
const
