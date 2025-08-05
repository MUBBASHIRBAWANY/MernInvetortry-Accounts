import React from 'react'
import TransferOutList from '../../Components/TransferOut/TransferOutList'
import { Link } from 'react-router-dom'
import TransferoutPostModal from '../../Components/TransferOut/TransferoutPostModal'
import TransferoutUnpostModal from '../../Components/TransferOut/TransferOutUnpostModal'




const TransferOutListPage = () => {
    return (
        <>
            <div>
                <Link to='/TransferOutAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
                        Add
                    </button>
                </Link>
                <Link to='/TransferOutBuklAdd'>
                    <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
                        Add in Bulk
                    </button>
                </Link>
                <span className='ml-[50%]' >
                    <TransferoutPostModal />
                    <span className='px-5'></span>
                    <TransferoutUnpostModal />
                </span>
            </div>
            <TransferOutList />
        </>
    )
}

export default TransferOutListPage