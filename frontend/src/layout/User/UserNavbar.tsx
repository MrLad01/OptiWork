// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ArrowDown2, HambergerMenu, Notification, SearchNormal, User } from 'iconsax-react'
import logo from '../../assets/logo.jpg'
import { Dispatch, SetStateAction, useState } from 'react'
import { useAuth } from '../../context/AuthContext'

type NavParams = {
  showSidebar: boolean
  setShowSidebar: Dispatch<SetStateAction<boolean>>
}

export const UserNavbar = ({showSidebar, setShowSidebar}: NavParams) => {
  const { user } = useAuth();
  const [openNotification, setOpenNotification] = useState<boolean>(false);
  const [readNotification, setReadNotification] = useState<boolean>(false);
  

  return (
    <div className="w-[100vw] px-6 py-3 top-0 flex items-center justify-between">
      <div className='flex items-center'>
        <button className=' mr-4 outline-0' onClick={() => setShowSidebar(!showSidebar)} title='toggle menu'>
          <HambergerMenu 
            size="28" 
            // color="#FF8A65"
            />
          </button>
        {/* <FontAwesomeIcon icon="fa-solid fa-bars" /> */}
        <img src={logo} alt="Optiwork logo" className='w-16 h-12 object-contain' />
        <h1 className='font-bold text-2xl ml-2 -mt-1'>OptiWork</h1>
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
        <div className="relative">
          <button title='notification' className='mb-2' onClick={() => setOpenNotification(!openNotification)}>
            <Notification size="24" />
          </button>
          { openNotification && 
          <div className='absolute top-9 -right-6 w-fit h-fit p-4 rounded-md bg-white border'>
            <div className='w-[22rem] h-fit'>
              <div className={`h-fit flex justify-between cursor-pointer`}>
                  {
                    user && user?.notification.map( note =>
                      <>
                        <div className="flex flex-col h-fit"  key={note.id}>
                          <div className='font-semibold'>
                             {note.from}
                          </div>
                          <div className='w-[85%] text-sm text-gray-400 text-nowrap '>
                              {note.msg}
                          </div>
                        </div>
                        <div className='text-xs text-gray-300'>
                              {note.date}
                        </div>
                      </>
                    )
                  }
              </div>
            </div>  
          </div>}
          </div>
        <button className='flex gap-2 items-center'>
          <div title='user image' className='border-2 p-2 rounded-full'>
            <User size="28" />
          </div>
          <div><ArrowDown2 size="16" /></div>
        </button>
      </div>
    </div>
  )
}

