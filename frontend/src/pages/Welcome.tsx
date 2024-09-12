// import React from 'react'
import { BarLoader } from 'react-spinners'
import logo from '/logo.webp'

const Welcome = () => {
  return (
    <div className="w-[100vw] h-[100vh] flex justify-center">
        <div className='relative p-10'>
            <img src={logo} alt="OptiWork Logo" className='w-[40vw] h-[60vh] object-contain' />
            <BarLoader className='absolute bottom-[5.4rem] left-[6.5rem]' width={350} color='#0082B3' />
        </div>
    </div>
  )
}

export default Welcome