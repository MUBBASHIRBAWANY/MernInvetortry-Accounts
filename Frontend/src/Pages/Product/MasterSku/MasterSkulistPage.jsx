import React from 'react'
import MasterSkulist from '../../../Components/Product/MasterSku/MasterSkulist'
import { Link } from 'react-router-dom'

const MasterSkulistPage = () => {
  return (
    <>
      <div>
        <Link to='/masterskuadd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
            Add
          </button>
        </Link>
        <Link to='/BulkMasterPage'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
            Add in Bulk
          </button>
        </Link>
      </div>
      <MasterSkulist />

    </>
  )
}

export default MasterSkulistPage