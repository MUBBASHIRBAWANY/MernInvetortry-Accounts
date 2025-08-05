import React from 'react'
import BrandList from '../../../Components/Product/Brand/BrandList'
import { Link } from 'react-router-dom'

const BrandListPage = () => {
    return (
        <>
            <div>
                <Link to='/BrandAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
                        Add
                    </button>
                </Link>
                <Link to='/BulkBrandAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
                        Add in Bulk
                    </button>
                </Link>
            </div>
            <BrandList />
        </>
    )
}

export default BrandListPage