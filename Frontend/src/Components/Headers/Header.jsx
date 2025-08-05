import React, { useState } from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { open, toggle } from '../../Redux/Reducers/sidebarReducer';
import OpensideBar from '../Sidebar/OpensideBar';

const HomeComponent = (data ,Componants) => {

  const dispatch = useDispatch()
 
     const SidebarOpen =  useSelector((state)=> state.isSideBar.state)
    console.log(SidebarOpen)
    


const toggleSidebar = () => {
  dispatch(open())
};


    // Toggle the sidebar

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
      };
  return (
    <div>
    
    {/* Main Content */}
   
      {/* Header */}
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-600 lg:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-gray-800">Distribution System </h1>
        <div className="flex items-center space-x-4">
          <button className="text-gray-600 hover:text-gray-800 focus:outline-none">
            
          </button>
          
        </div>
      </header>

      
            

    
  
  </div>
);
}
export default HomeComponent