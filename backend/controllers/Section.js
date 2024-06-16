const Course=require("../models/Course");
const Section=require("../models/Section");


exports.createSection =async (req , res)=>{
    try{

        //data fetch
        const {sectionName , courseId}=req.body ;

        //data validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success :false ,
                message :"Missing Properties"
            })
        }

        //create section
        const newSection=await Section.create({sectionName});

        //update course with section objectId
        const updatedCourseDetails=await Course.findByIdAndUpdate(
            courseId ,
             {
                $push:{
                    courseContent :newSection.id ,
                }
            } ,
            {new :true}
        );

        //HW :use populate to replace section/subsectons both in the updatedCourseDetails 

        //return response 

        return res.status(200).json({
            success :true ,
            message :"Section Created Successsfully" ,
            updatedCourseDetails ,
        })

    }

    catch(error){
        return res.status(500).json({
            success :false ,
            message :"Unable to create section  " ,
            error :error.message   ,
        })


    }
}


//update section
exports.updateSection =async (req ,res)=>{
    try{

        //data input
        const {sectionName , sectionId}=req.body ;
        //data validation 
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success :false  ,
                message :"Missing Properties"
            })
        }

        //update data
        const section=await Section.findByIdAndUpdate(sectionId , {sectionName} , {new :true});
          //hmoework  ;do we need to delete from the course schema 
         //return res
         return res.status(200).json({
            success :true ,
            message :"Section UPdated Successfully"
         })






    }
    catch(error){
        return res.status(500).json({
            success :false ,
            message :"Unable to Update Section  " ,
            error :error.message   ,

        })
    }
}
    //delete section

    exports.deleteSection =async (req , res)=>{
        try{
             //also test with params
            //get Id - asuming that we are sending ID in params
            const {sectionId} =req.body;
            //HW -course ko update karo
            if(!sectionId){
                return res.status(400).json({
                    success :false  ,
                    message :"Missing Properties"
                })

            }



            await Section.findByIdAndDelete(sectionId) ;

            return res.status(200).json({
                success :true ,
                message :"Section deleted Successfully"
             })





        } 
        catch(error){

            return res.status(500).json({
                success :false ,
                message :"Unable delete section"  ,
                error :error.message
            })

        }
    }


