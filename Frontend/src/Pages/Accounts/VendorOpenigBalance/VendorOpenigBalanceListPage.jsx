import React from 'react'
import VendorOpenigBalanceList from '../../../Components/Accounts/OpeningBalance/VendorOpenigBalance/VendorOpenigBalanceList'
import { Link } from 'react-router-dom'

const VendorOpenigBalanceListPage = () => {
    return (
        <>
            <div>
                <Link to='/VendorOpenigBalanceAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
                        Add
                    </button>
                </Link>
              
            </div>
            
                <VendorOpenigBalanceList />
            
        
    </>
  )
}

export default VendorOpenigBalanceListPage