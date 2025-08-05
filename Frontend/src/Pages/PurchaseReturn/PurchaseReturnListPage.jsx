import React from 'react'
import PurchaseReturnList from '../../Components/PurchaseReturn/PurchaseReturnList'
import { Link } from 'react-router-dom'
import PurchaseReturnReturnPost from '../../Components/PurchaseReturn/PurchaseReturnPostModal'
import PurchaseReturnReturnUnPost from '../../Components/PurchaseReturn/PurchaseReturnUnPostModal'

const PurchaseReturnListPage = () => {
    return (
        <>
            <div>
                <Link to='/PurchaseReturnAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-[0.6vw] py-[0.6vw] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5vw] mx-5 my-5'>
                        Add
                    </button>
                </Link>
                <Link to='/PurchaseReturnBulkAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-[0.6vw] py-[0.6vw] me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5vw] mx-5 my-5 '>
                        Add in Bulk
                    </button>
                </Link>

                <span className='ml-[50%]' >
                    <PurchaseReturnReturnPost />
                </span>
                <span className='px-[1vw]'>
                    <PurchaseReturnReturnUnPost />
                </span>

            </div>

            <PurchaseReturnList />
        </>
    )
}

export default PurchaseReturnListPage