// import React from 'react'
import { ArrowDown2, HambergerMenu, Notification, SearchNormal, User } from 'iconsax-react'
import logo from '../../assets/logo.jpg'
import { Dispatch, SetStateAction, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

type NavParams = {
    showSidebar: boolean
    setShowSidebar: Dispatch<SetStateAction<boolean>>
  }

export const AdminNavbar = ({showSidebar, setShowSidebar}: NavParams) => {
    const { user } = useAuth();
    const [openNotification, setOpenNotification] = useState<boolean>(false);
  return (
    <div className="w-[100vw] px-6 py-3 top-0 flex items-center justify-between">
        <div className='flex items-center'>
        <button className=' mr-4 outline-0' 
            onClick={() => setShowSidebar(!showSidebar)} 
            title='toggle menu'
            >
            <HambergerMenu 
            size="24" 
            // color="#FF8A65"
            />
            </button>
        {/* <FontAwesomeIcon icon="fa-solid fa-bars" /> */}
        <img src={logo} alt="Optiwork logo" className='w-12 h-8 object-contain' />
        <h1 className='font-bold text-xl ml-2 -mt-1'>OptiWork</h1>
        <h1 className='font-semibold text-[0.61rem] ml-2 mt-2 border rounded-md px-1 py-[0.1rem] border-black'>Admin</h1>
        </div>
        <div className='flex items-center gap-5'>
        <div>
        <div className="relative">
            <input 
                type="text" 
                placeholder="Search..." 
                className="border pl-8 pr-4 py-1 rounded-md text-sm w-full"
            />
            <SearchNormal 
                size="16" 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <h3 className="font-semibold text-xs">{user?.company_name || 'Company Name' }</h3>
              <h4 className="text-xs max-w-40 break-words">{user?.company_email || 'Company Email' }</h4>
            </div>
            <div>
              <div className='w-10 h-10 rounded-full border-2'></div>
            </div>
          </div>
        <div className="relative">
            <button title='notification' className='mt-1' 
                onClick={() => setOpenNotification(!openNotification)}
            >
            <Notification size="20" />
            </button>
            { openNotification && 
            <div className='absolute top-9 -right-6 w-fit h-fit p-4 rounded-md bg-white border'>
            <div className='w-[22rem] h-fit'>
                <div className={`h-fit flex justify-between cursor-pointer`}>
                    {
                    // user && user?.notification.map( note =>
                    //     <>
                    //     <div className="flex flex-col h-fit"  key={note.id}>
                    //         <div className='font-semibold'>
                    //         {note.from}
                    //         </div>
                    //         <div className='w-[85%] text-sm text-gray-400 text-nowrap '>
                    //             {note.msg}
                    //         </div>
                    //     </div>
                    //     <div className='text-xs text-gray-300'>
                    //             {note.date}
                    //     </div>
                    //     </>
                    // )
                    }
                </div>
            </div>  
            </div>
            }
            </div>
        <button className='flex gap-2 items-center'>
            <div title='user image' className='border-2 p-2 rounded-full'>
            <User size="20" />
            </div>
            <div><ArrowDown2 size="16" /></div>
        </button>
        </div>
    </div>
    )
}
