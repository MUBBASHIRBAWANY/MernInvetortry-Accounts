import React from 'react'
import ProductList from '../../../Components/Product/Product/ProductList'
import { Link } from 'react-router-dom'


const ProductListPage = () => {
  return (
    <>
      <div>
        <Link to='/ProductAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
            Add
          </button>
        </Link>
        <Link to='/ProductBulkAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
            Add in Bulk
          </button>
        </Link>
      </div>
      <ProductList />
    </>
  )
}

export default ProductListPage