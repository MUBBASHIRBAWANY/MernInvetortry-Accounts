import React from 'react'
import StockReplacementList from '../../Components/StockReplacement/StockReplacementList'
import { Link } from 'react-router-dom'
import StockReplacementPost from '../../Components/StockReplacement/StockReplacementPost'
import StockReplacementUnPost from '../../Components/StockReplacement/StockReplacementUnpost'

const StockReplacementListPage = () => {
  return (
     <>
      <div className="flex flex-wrap  justify-between mx-10 gap-6 my-4">
        {/* Buttons */}
        <div className="flex gap-4">
          <Link to='/StockReplacementAdd'>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Add
            </button>
          </Link>
          <Link to='/StockReplacementBulkAdd'>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Add in Bulk
            </button>
          </Link>
        </div>

        <div className="flex gap-1 mr-[5vw]">
          <span className='px-5'>
            <StockReplacementPost />
          </span>
              <span className='px-5'>
            <StockReplacementUnPost />
          </span>
        </div>
      </div>
      <StockReplacementList />
    </>
  )
}

export default StockReplacementListPage