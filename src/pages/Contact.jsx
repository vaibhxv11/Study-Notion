import React from 'react'
import ContactDetails from '../components/core/ContactUs/ContactDetails'
import ContactForm from '../components/core/ContactUs/ContactForm'
const Contact = () => {
  return (
    <div className='flex mx-auto mt-20 w-11/12 max-w-maxContent flex-col  justify-between gap-10 text-white lg:flex-row  '>
        <div className='lg:w-[40%]'>
         <ContactDetails/>

        </div>
        <div className=' lg:w-[55%]'>
            <ContactForm/>

        </div>


    </div>
  )
}

export default Contact