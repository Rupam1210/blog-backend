const express=require('express')
const router=express.Router()
const User= require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

router.post("/register",async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        const salt=await bcrypt.genSalt(10);
        const hashpas=await bcrypt.hash(password,salt);
        const newuser= new User({username,email,password:hashpas})
        const saveuser=await newuser.save()
        res.status(200).json(saveuser)
    } catch (error) {
        res.status(500).json(error)
        
    }
})
//login
router.post("/login",async(req,res)=>{
    try {
        const user=await User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json("User not Found")
        }
        const match=await bcrypt.compare(req.body.password,user.password)
        if(!match){
            return res.status(401).json("wrong credentials")
        }
        const token=jwt.sign({_id: user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"3d"})
        const {password,...info}= user._doc
         res.cookie("token",token,{ 
             sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
             secure: process.env.NODE_ENV === "Development" ? false : true,}
         ).status(200).json(info)
    } catch (error) {
        res.status(500).json(error)
    }
})
// logout
 router.get("/logout",async(req,res)=>{
    try {
        res.clearCookie("token",{sameSite:"none",secure:true}).status(200).send("user loggout succesful!")
    } catch (error) {
        res.status(500).json(error)
    }
 })
 //refetch
 router.get("/refetch", (req,res)=>{
    const token=req.cookies.token
    jwt.verify(token,process.env.SECRET,{},async (err,data)=>{
        if(err){
            return res.status(404).json(err)
        }
        res.status(200).json(data)
    })
})

module.exports=router