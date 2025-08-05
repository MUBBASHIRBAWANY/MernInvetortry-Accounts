import React from 'react'
import ClientList from '../../../Components/Client/Client/ClientList'
import { Link } from 'react-router-dom'

const ClientListPage = () => {
  return (
    <>
      <div>
        <Link to='/Clientadd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
            Add
          </button>
        </Link>
        <Link to='/ClientBulkAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
            Add in Bulk
          </button>
        </Link>
      </div>

      <ClientList />

    </>

  )
}

export default ClientListPage