const User=require('../models/User')
const Profile=require('../models/Profile')
const OTP=require('../models/OTP')
const otpGenerator=require("otp-generator")   //instance
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')
const { hmac_rawurlsafe_base64_string } = require('../utils/hmacUtils');
require("dotenv").config();
const {sendSuprSendEvent}=require("../utils/sendSuprSendEvent")


//sendOtp

exports.sendOtp=async (req , res) =>{

    try {
        const {email} =req.body;
     
    //check if user already exists
    const checkUserPresent =await User.findOne({email});
   
    //if user already exist , then return a response

    if(checkUserPresent){
        return res.status(401).json({
            success :false ,
            message :"User Already Registered"
        })
    }

    //generate OTP
     var otp=otpGenerator.generate(6, {
        upperCaseAlphabets :false ,
        lowerCaseAlphabets :false ,
        specialChars :false ,
     })
     console.log("OTP generated"  , otp)

     //check unique otp or not
     let result =await OTP.findOne({otp : otp});

     while (result) {
        otp = otpGenerator.generate(6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false,
        });
        result = await OTP.findOne({ otp });
    }
      const otpPayload = { email, otp }


     //create an entry for OTP

     const otpBody=await OTP.create(otpPayload);
     console.log(otpBody);

  

     // Send OTP via email
    
    //  const htmlContent = otpTemplate(otp);
    // //    console.log('HTML Content:', htmlContent); // Log HTML content to check its structure
 
    //  await mailSender(email, "OTP Verification -  StudyNotion" , htmlContent);

     //return response successfull
     res.status(200).json({
        success :true ,
        message :'OTP sent Successfully' ,
        otp

     })


    }
    catch(error){

        res.status(500).json({
            success :false ,
            message :'Internal server Error' ,
    
         })

    }



}

  





//signup
exports.signUp = async (req, res) => {
    try {
        // Data fetch from req body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp
        } = req.body;

        // Validation
        if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Check both passwords
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and Confirm Password do not match"
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User is already registered"
            });
        }

        // Find most recent OTP stored for user
        const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        // Validate OTP
        if (recentOtp.length == 0 || otp !== recentOtp[0].otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // Hash password (required bcrypt)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create entry in DB
        const profileDetails = await Profile.create({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber: null,
            linkedin: null
        });

        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password: hashedPassword,
            accountType,
            additionalDetails: profileDetails._id,
            image: `https://api.dicebear.com/5.x/initials/svg?seed=${initials}`
        });

        //Generate Subscriber id for SuprSend

        const inboxSecret=process.env.INBOX_SECRET;
        const subscriber_id=hmac_rawurlsafe_base64_string(user.email, inboxSecret);
      
        user.subscriber_id=subscriber_id;
        await user.save();








        // Return response
        return res.status(200).json({
            success: true,
            message: "User is Registered Successfully",
            user
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again!"
        });
    }
};


//Login

exports.login=async (req , res)=>{
    try{

        //get data from req body

        const {email , password}=req.body;
        //valiadation data 
        if(!email || !password){
            return res.status(403).json({
                success :false ,
                message :"All fields required"
            })
        } 

        //user check exist or not
        const user=await User.findOne({email}).populate("additionalDetails");

        if(!user){
            return res.status(401).json({
                success :false,
                message :"User is not registered"
           })

        }

        //generate JWT , after password matching

        if(await bcrypt.compare(password , user.password)){
            const payload={
                email : user.email ,
                id :user._id ,
                accountType :user.accountType ,


            }
            const token=jwt.sign(payload , process.env.JWT_SECRET , {
                expiresIn :"2h" ,
                
            })

            user.token=token;
            user.password=undefined;

            

        
           
          
        //create cookie and send response
       
          const options={
            expires :new Date(Date.now() + 3*24*60*60*1000) ,
            httpOnly :true
          }

          const result = await sendSuprSendEvent(
            user.email,
            'USER_LOGIN',
            {
              user: 'VaibhavDudhal'
            }
          );
    
          if (result.success) {
            console.log("SuprSend event triggered successfully");
          } else {
            console.log("Failed to trigger SuprSend event:", result.error);
          }

        res.cookie("token" , token  ,options).status(200).json({
            success:true ,
            token ,
            user ,
            message :"Logged In successfully" ,
        })

        

    }
        else
        { 
            return res.status(401).json({
                success :false ,
                message :"Password is Incorrect"
            })
        }

    


    }
    catch(error){
        
        console.log(error)
        return res.status(500).json({
            success:false ,
            message :"Login Failed"
        });

    }

}






//changePassword
exports.changePassword=async (req , res)=>{

    //get data from req body
    //get oldpassword , new Password , confiromPassword
    //valiadtion

    //upadate password in Db
    //send mail -Password Updated
    //return response

}
