const express =require("express");
const app=express();

const userRoutes =require("./routes/User")
const  profileRoutes =require("./routes/Profile")
const paymentRoutes =require("./routes/Payments")
const courseRoutes =require("./routes/Course")
const contactUsRoute = require("./routes/Contact");
const database =require("./config/database");
const cookieParser  =require("cookie-parser");
//to connect with frontend
const cors =require('cors')
const {cloudinaryConnect} = require("./config/cloudinary")
const fileUpload=require("express-fileupload")
const dotenv =require("dotenv");

dotenv.config();
const PORT =process.env.PORT ;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
            //frontend link
    cors({
         origin:"https://study-notion-11.vercel.app" ,
         credentials :true
    })

)
//fileupload 
app.use(
    fileUpload({
        useTempFiles :true ,
        tempFileDir :"/tmp"
    }) 
)
//cloudinary connection
cloudinaryConnect();


//mount routes

app.use("/api/v1/auth" , userRoutes)
app.use("/api/v1/profile" , profileRoutes)
app.use("/api/v1/course" , courseRoutes)
app.use("/api/v1/payment" , paymentRoutes)
app.use("/api/v1/reach", contactUsRoute);


//default route 
app.get("/" , function(req , res) {
    return res.json({
        success :true ,
        message :"YOur server is up and running.."
    })
})


app.listen(PORT, ()=>{
    console.log(`App is running at ${PORT}`)
})


