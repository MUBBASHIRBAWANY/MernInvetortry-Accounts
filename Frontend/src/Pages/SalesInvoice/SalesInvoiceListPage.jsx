import React from 'react'
import SalesInvoiceList from '../../Components/SalesInvoice/SalesInvoiceList'
import { Link } from 'react-router-dom'
import SaleInvoicePostModal from '../../Components/SalesInvoice/SaleInvoicePostModal'
import SaleInvoiceUnPostModal from '../../Components/SalesInvoice/SaleInvoiceUnpostModal'
import SaleInvoiceFilterPostModal from '../../Components/SalesInvoice/SaleInvoiceFilterModal'

const SalesInvoiceListPage = () => {

  return (
    <>
      <div className="flex flex-wrap  justify-between mx-10 gap-6 my-4">
  {/* Buttons */}
  <div className="flex gap-4">
    <Link to="/SalesInvoiceAdd">
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Add
      </button>
    </Link>
    <Link to="/SalesInvoiceBulkAdd">
      <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
        Add in Bulk
      </button>
    </Link>
  </div>

  {/* Modals */}
  <div className="flex gap-4">
    <SaleInvoicePostModal />
    <SaleInvoiceUnPostModal />
    <SaleInvoiceFilterPostModal />
  </div>
</div>

      <SalesInvoiceList />
    </>
  )
}

export default SalesInvoiceListPage