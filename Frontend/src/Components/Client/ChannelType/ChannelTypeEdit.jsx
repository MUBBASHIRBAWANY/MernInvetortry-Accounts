import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import {  updateDataFunction } from '../../../Api/CRUD Functions'

const ChannelTypeEdit = () => {
  const { id } = useParams()
  const editChannelType = useSelector((state) => state.ChannelType.channelType)
  console.log(editChannelType)
  const Vendor = useSelector((state) => state.Vendor.state)
  const [editCat, seteditCat] = useState([])
  const [vendorSelect, setSelectVendor] = useState(undefined)
  const getData = () => {
    const data = editChannelType.find((item) => item._id == id)
    seteditCat(data)
    
    if (data) {
      reset({
        ChanneTypeName: data.ChanneTypeName,
        salesFlowRef: data.salesFlowRef,
      })
    }

  }
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const pageName = "ChannelEdit"
  const checkAcess = async () => {
    console.log(UserRihts)
    const allowAcess = await UserRihts.find((item) => item == pageName)
    console.log(allowAcess)
    if (!allowAcess) {
      navigate("/")
    }
  }
  useEffect(() => {
    getData()
  }, [])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset

  } = useForm();
  const navigate = useNavigate()
  const onSubmit = async (data) => {
    try {
      updateDataFunction(`/chanelType/updateChannelType/${id}`, data)
      toast.success("Data Edit")
      setTimeout(() => {
        navigate('/ChannelTypeList')
      }, 2000);
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Channel Type</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Channel Type Name </label>
              <input
                type="text"
                defaultValue={editCat.ChannelName}
                {...register("ChanneTypeName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
           
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChannelTypeEdit