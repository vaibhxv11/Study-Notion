const  User=require("../models/User")
const mailSender=require("../utils/mailSender")
const bcrypt=require("bcrypt");
const crypto =require("crypto")

//resetPasswordToken

exports.resetPasswordToken=async (req, res)=>{

  try{
      //get email from req body
      const email=req.body.email;
    
      //check user for this email , email validation
      const user=await User.findOne({email :email})
      if(!user){
          return res.json({
              success  :false ,
              message :"Your Email is not registered with us"
          })
      }
      //generate token 
  
      const token=crypto.randomUUID();
  
     
      //update user by adding token and expiration time
      const updateDetails=await User.findOneAndUpdate({email :email} , 
          {
              token :token ,
              resetPasswordExpires :Date.now()+5*60*1000 ,
          } ,{
              new :true //new :true is 3rd parameter , it returns updated user
          })
  
  
      //create url
  
      const url =`http://localhost:3000/reset-password/${token}`
  
      //send  mail containg the url
       await mailSender(email ,
           "Password Reset Link" ,
           `Password Reset Link : ${url}`  );
      //return response
  
      return res.status(200).json({
          success :true ,
          message :"Email sent successfully , Please check email and change password"
  
      })

  } catch(error){

    console.log(error);
    return res.status(500).json({
        success :false ,
        message :'Something went wrong'
    })

  }





}

//resetPassword

exports.resetPassword=async (req ,res)=>{
   try{
     //data fetch
     const {password , confirmPassword , token} =req.body ;
    //validaton
    if(password !== confirmPassword){
        return res.json({
            success :false ,
            message :"Password NOt Matching"
        })
    }
    
    //get userdetails from db using token
    const userDetails=await User.findOne({token :token}) ;

    // if no entry  invalid token
    if(!userDetails){
        return res.json({
            success :false ,
            message :"Token is Invalid"
        })
    }
    //token time check
    if(userDetails.resetPasswordExpires <  Date.now()){
        return res.json({
            success :false ,
            message :"Token is expired , PLease regenerate token "
        })  

    }
    //hash password
    const hashedPassword=await bcrypt.hash(password , 10)    

    //update password 
    await User.findOneAndUpdate(
        {token :token} ,
        {password :hashedPassword} ,
        {new :true } ,
    )
    //return response
    return res.status(200).json({
        success :true ,
        message:"Password Reset Successfull"

    })

   } 
   catch(error){
    return res.status(401).json({
        success :true ,
        message :"Password Reset Failed"
    })

   }

}