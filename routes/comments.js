const express=require("express");
const router=express.Router();
const User=require('../models/User')
const bcrypt=require('bcrypt')
const Post=require('../models/Post')
const Comments = require("../models/Comments");
const verifyToken = require("../Verifytoken");

router.post("/create",verifyToken,async(req,res)=>{
    try {
        const newcomment= new Comments(req.body)
        const newc = await newcomment.save()
          res.status(200).json(newc)
    } catch (error) {
        res.status(500).json(error)
    }
})
//update
router.put("/:id",verifyToken,async(req,res)=>{
    try {
        const updatecomment=await Comments.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatecomment)
    } catch (error) {
        res.status(500).json(error)
    }
})
//delete
router.delete("/:id",verifyToken,async(req,res)=>{
    try {
        const delcomment=await Comments.findByIdAndDelete(req.params.id)
        res.status(200).json("commnet has been delete")
    } catch (error) {
        res.status(500).json(error);
    }
})
//fetch all
router.get("/post/:postId",async(req,res)=>{
    try {
        const comment=await Comments.find({postId:req.params.postId})
        res.status(200).json(comment)
    } catch (error) {
        res.status(500).json(error)
    }
})
module.exports=router
