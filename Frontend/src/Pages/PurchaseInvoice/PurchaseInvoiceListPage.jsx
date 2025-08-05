import React from 'react'
import PurchaseInvoiceList from '../../Components/PurchaseInvoice/PurchaseInvoiceList'
import { Link } from 'react-router-dom'
import InvoiceSelectionModal from '../../Components/PurchaseInvoice/InvoiceSelectionModal'
import InvoiceUnpostModal from '../../Components/PurchaseInvoice/InvoiceUnpostModal'

const PurchaseInvoiceListPage = () => {
  return (
    <>
      <div>
        <Link to='/PurchaseInvoiceAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-[0.6vw] py-[0.6vw] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5vw] mx-5 my-5'>
            Add
          </button>
        </Link>
        <Link to='/PurchaseInvoiceBulk'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-[0.6vw] py-[0.6vw] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5vw] mx-5 my-5 '>
            Add in Bulk
          </button>
        </Link>
  
          <span className='ml-[50%]' >
            <InvoiceSelectionModal /> 
            </span>
          <span className='px-[1vw]'>
            <InvoiceUnpostModal />
          </span>
  
      </div>

      <PurchaseInvoiceList />
    </>
  )
}

export default PurchaseInvoiceListPage