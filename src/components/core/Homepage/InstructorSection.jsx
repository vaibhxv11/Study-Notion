import React from 'react'
import HighlightText from './HighlightText'
import CTAButton from  "./Button"
import {FaArrowRight} from "react-icons/fa"
import Instructor from "../../../assets/Images/Instructor.png"

const InstructorSection = () => {
  return (
    <div className='flex flex-col   lg:flex-row items-center justify-between mt-20 '>
          {/* image */}
        <div className='w-[50%]  ' >
            <img
            src={Instructor} 
            alt=""
            className='shadow-white'
            
            />


        </div>
        {/* section 2 */}
        <div className='w-[45%] flex flex-col lg:ml-36 gap-6 items-center '>

            <div className='text-4xl font-semibold'>
                Become an <HighlightText text={"Instructor"}/>
            </div>
            <div className='text-semibold text-center'>
                Instructors from around the world teach millons of students 
                StudyNotion. We provide the tools and skills to teach what you love.
            </div>
            <div className='flex '>

                <CTAButton active={true} linkto={"/signup"}>
                    <div className=' flex gap-3 flex-row items-center'>
                    Start Teaching Today
                    <FaArrowRight/>
                    </div>
                </CTAButton>
                
            </div>

        </div>
          

    </div>
  )
}

export default InstructorSection