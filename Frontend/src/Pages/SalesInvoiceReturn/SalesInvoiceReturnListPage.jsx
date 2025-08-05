import React from 'react'

import { Link } from 'react-router-dom'
import SalesInvoiceReturnList from '../../Components/SalesInvoiceReturn/SalesInvoiceReturnList'
import SalesInvoiceReturnPost from '../../Components/SalesInvoiceReturn/SalesInvoiceReturnPost'
import SalesInvoiceReturnUnPost from '../../Components/SalesInvoiceReturn/UnPostSalesInvoiceReturn'


const SalesInvoiceReturnListPage = () => {

  return (
    <>
      <div className="flex flex-wrap  justify-between mx-10 gap-6 my-4">
        {/* Buttons */}
        <div className="flex gap-4">
          <Link to='/SalesInvoiceReturnAdd'>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Add
            </button>
          </Link>
          <Link to='/SalesReturnBulkAdd'>
            <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Add in Bulk
            </button>
          </Link>
        </div>

        <div className="flex gap-1 mr-[5vw]">
          <SalesInvoiceReturnPost />
          <span className='px-5'></span>
          <SalesInvoiceReturnUnPost />
        </div>
      </div>
      <SalesInvoiceReturnList />
    </>
  )
}

export default SalesInvoiceReturnListPage