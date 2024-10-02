import React, { useState } from 'react'
import { FolderAdd, Trash, User } from "iconsax-react"
import { useAuth } from '../../../context/AuthContext';

export const AdminPersonalSetting = () => {

  const { user } = useAuth();

  const [firstName, setFirstName] = useState(user?.first_name)
  const [lastName, setLastName] = useState(user?.last_name)
  const [userName, setUserName] = useState(user?.username)
  
  const [password, setPassword] = useState(user?.password)

  return (
    <div className="w-full h-full bg-white rounded-md  px-5 py-4 flex flex-col gap-3">
      <h1 className="text-base font-semibold">Personal Setting</h1>
        <div className="w-full h-full bg-white rounded-lg px-4 pt-6 pb-12 flex flex-col gap-5">
            <div className="flex items-center gap-6">          
              <div title='user image' className='border-2 p-4 rounded-full w-fit'>
                <User size="48" />
              </div>
              <div className="flex gap-2">
                <button className="flex gap-2 border-2 items-center rounded-lg px-3 py-2 text-sm">
                  <div>
                    <FolderAdd size="19" />
                  </div>
                  <span>Upload</span>
                </button>
                <button className="flex gap-1 rounded-lg px-3 py-2 text-sm text-red-400">
                  <div>
                    <Trash size="19" color="#FF8A65"/>
                  </div>
                  <span>Remove</span>
                </button>
              </div>
            </div>
            <div className=" w-full h-full gap-4 flex flex-col pb-6 items-center">
                <div className="w-[94%] h-full flex justify-between text-sm">
                  <div className="h-full w-[48%] p-2 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>First Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your First Name" 
                        className="border-2 px-2 py-1"
                        value={firstName} 
                        onChange={e => setFirstName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>Username</label>
                      <input 
                        type="text" 
                        placeholder="Enter your Username" 
                        className="border-2 px-2 py-1"
                        value={userName} 
                        onChange={e => setUserName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>Role</label>
                      <input 
                        type="text" 
                        placeholder="User" 
                        value={user?.role} 
                        disabled 
                        className="border-2 cursor-not-allowed px-2 py-1" 
                        />
                    </div>
                    {/* <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>First Name</label>
                      <input type="text" placeholder="Enter your First Name" className="border-2 px-2 py-1" />
                    </div> */}
                  </div>
                  <div className="h-full w-[48%] p-2 flex flex-col gap-4">
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>Last Name</label>
                      <input 
                        type="text" 
                        placeholder="Enter your Last Name" 
                        className="border-2 px-2 py-1"
                        value={lastName} 
                        onChange={e => setLastName(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>Password</label>
                      <input 
                        type="password" 
                        placeholder="Enter your Password" 
                        className="border-2 px-2 py-1"
                        value={password} 
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>Skills</label>
                      <input type="text" placeholder="Enter your Skill" className="border-2 px-2 py-1" />
                    </div>
                    {/* <div className="flex flex-col gap-1">
                      <label htmlFor="" className='font-medium'>Last Name</label>
                      <input type="text" placeholder="Enter your Last Name" className="border-2 px-2 py-1" />
                    </div> */}
                  </div>
                </div> 
                <div className="w-[94%] h-[15%] flex justify-between px-2">
                  <div className="flex gap-3">
                    <button className="border py-2 px-6 rounded-lg text-sm">Save</button>
                    <button className="border py-2 px-6 rounded-lg text-sm">Cancel</button>
                  </div>
                  <div>
                    <button className="border py-2 px-6 rounded-lg text-sm">Delete Account</button>
                  </div>
                </div>
            </div>
        </div>
    </div>
  )
}
