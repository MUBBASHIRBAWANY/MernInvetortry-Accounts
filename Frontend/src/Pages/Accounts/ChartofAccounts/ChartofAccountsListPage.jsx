import React from 'react'
import ChartofAccountsList from '../../../Components/Accounts/Chart of Accounts/ChartofAccountsList'
import { Link } from 'react-router-dom'

const ChartofAccountsListPage = () => {
  return (

    <>
      <div>
        <Link to='/ChartofAccountsAdd'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5'>
            Add
          </button>
        </Link>

        <Link to='/ChartofAccountsViwePage'>
          <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[8%] mx-5 my-5'>
            Account Tree View
          </button>
        </Link>
      </div>
      <ChartofAccountsList />

    </>



  )
}

export default ChartofAccountsListPage