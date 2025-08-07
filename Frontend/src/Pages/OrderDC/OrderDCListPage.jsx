import React from 'react'
import SaleOrderList from '../../Components/SaleOrder/SaleOrderList'
import { Link } from 'react-router-dom'
import OrderDCList from '../../Components/OrderDC/OrderDCList'
import OrderDCPostModal from '../../Components/OrderDC/OrderDCPostModal'
import OrderDCUnPostModal from '../../Components/OrderDC/OrderDCUnPostModal'

const OrderDCListPage = () => {
  return (
    <>
      <div>
        <Link to='/OrderDCAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-[0.6vw] py-[0.6vw] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5vw] mx-5 my-5'>
            Add
          </button>
        </Link>
        <span className='ml-[50%]' >
          <OrderDCPostModal />
        </span>
        <span className='px-[1vw]'>
          <OrderDCUnPostModal />
        </span>
      </div>
      <OrderDCList />
    </>
  )
}

export default OrderDCListPage