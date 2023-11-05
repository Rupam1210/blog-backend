const express=require('express')
const router=express.Router()
const User=require('../models/User')
const Post=require('../models/Post')
const Comment=require('../models/Comments') 
const verifyToken = require('../Verifytoken')

//crate

router.post("/create",verifyToken,async(req,res)=>{
    try {
        const newpost=new Post(req.body);
        const savpost=await newpost.save();
        res.status(200).json(savpost)
    } catch (error) {
        res.status(500).json(error)
    }
})


// update

router.put("/:id",verifyToken,async(req,res)=>{
    try {
        
        const updatepost=await Post.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json({updatepost,message:"Update Successfull"})
    } catch (error) {
        res.status(500).json(error)
    }
})
//delete
router.delete("/:id",verifyToken,async(req,res)=>{
    try {
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId:req.params.id})
        res.status(200).json("post has been delted")
    } catch (error) {
        res.status(500).json(error)
    }
})
//get post detail
router.get("/:id",async(req,res)=>{
    try {
        const post= await Post.findById(req.params.id);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
})
//get all post 
router.get("/",async(req,res)=>{
    const query =req.query

    try {
        const searchFilter={
            title:{$regex:query.search, $options:"i"}
        }
        const post= await Post.find(query.search?searchFilter:null);
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}
)
//get user post
router.get("/users/:userId",async(req,res)=>{
    try {
        const posts= await Post.find({userId:req.params.userId});
        res.status(200).json(posts)
    } catch (error) {
        res.status(500).json(error)
    }
})
//search post

module.exports=router