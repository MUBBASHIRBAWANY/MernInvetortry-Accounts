import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchUserRights } from '../../Redux/Reducers/UseRights'
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'
import { getDataFundtion } from '../../Api/CRUD Functions'

const Dashboard = () => {
  const dispatch = useDispatch()
  const loginuser = useSelector((state) => state.LoginerReducer.userDetail)

  const getData = async () => {
    try {
      const role = await getDataFundtion(`userRole/role/${loginuser.selectRole}`)
      dispatch(fetchUserRights(role.data.Roles))
    }
    catch (err) {
      console.log(err)
      toast.error("some thing went wrong")
    }
  }
  useEffect(() => {
    getData()
  }, [])
  return (

    <div>
      <ToastContainer />
      Dashboard</div>
  )
}

export default Dashboard