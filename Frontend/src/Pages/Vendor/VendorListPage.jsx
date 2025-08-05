import React from 'react'
import VendorList from '../../Components/Product/Vendor/VendorList'
import { Link } from 'react-router-dom'

const VendorListPage = () => {
  return (
    <>
      <div>
        <Link to='/VendorAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
            Add
          </button>
        </Link>
        <Link to='/VendorBulkAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
            Add in Bulk
          </button>
        </Link>
      </div>
      <VendorList />
    </>
  )
}

export default VendorListPage