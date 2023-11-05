const express=require("express");
const app=express();
const mongoose =require("mongoose");
const cors=require('cors')
const dotenv=require('dotenv');
const multer=require('multer')
const path=require("path")
const authRoute=require('./routes/auth.js');
const userRoute=require('./routes/user.js');
const postRoute=require('./routes/post.js');
const commentRoute=require('./routes/comments.js');
const cookieParser = require("cookie-parser");

const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected ${mongoose.connection.host}`)
        
    } catch (error) {
        console.log(error);
    }
}
//Midddleware 
dotenv.config();
app.use("/images",express.static(path.join(__dirname,"/images")))
app.use(cors({origin:"http://localhost:5173",credentials:true}))
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",authRoute)
app.use("/api/users",userRoute)
app.use("/api/posts",postRoute)
app.use("/api/coments",commentRoute)

//image upload
const storage=multer.diskStorage({
    destination:(req,file,fn)=>{
        fn(null,"images")
    },
    filename:(req,file,fn)=>{
        fn(null,req.body.img)
        // fn(null,"image1.png")

    }
})

const upload=multer({storage:storage})
app.post("/api/upload",upload.single("file"),(req,res)=>{
    // console.log(req.body)
    res.status(200).json("Image has been uploaded successfully!")
})
 
app.listen(process.env.PORT,()=>{
    connectdb();
    console.log(`app is running on localhost:${process.env.PORT}`)
   
})