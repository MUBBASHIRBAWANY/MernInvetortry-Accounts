import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import { generateNextCodeForMsku } from '../Global/GenrateCode';

const OderBookerAdd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },

  } = useForm();
  const navigate = useNavigate()
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  
  const Region = useSelector((state) => state.Region.Region)

  const pageName = "CategoryAdd"
  const [prRegion, setPrRegion] = useState("")
  const checkAcess = async () => {
    console.log(UserRihts)
    const allowAcess = await UserRihts.find((item) => item == pageName)
    console.log(allowAcess)
    if (!allowAcess) {
      navigate("/")
    }
  }

  const onSubmit = async (data) => {
    data.Region = prRegion
    console.log(data)
    try {
      const lastCode = await getDataFundtion(`/OrderBooker/lastcode`)
      console.log(lastCode)
      if (lastCode.data == null) {
        data.code = "001"
      }
      else {
        data.code = generateNextCodeForMsku(lastCode.data.code)
      }
      try {
        data.masterCode = Region.find((item) => item._id == prRegion).code + data.code
        const res = await createDataFunction('/OrderBooker', data)
        toast.success("Data Add")
        setTimeout(() => {
          navigate('/OrderBookerList')
        }, 2000);
      } catch (err) {
        console.log(err)
        toast.error('Some Thing Went Wrong')
      }


    } catch (err) {
      console.log(err)
      toast.error('Some Thing Went Wrong')
    }
  }
  const Regiondrp = Region.map((item) => {
    return { value: item._id, label: `${item.RegionName} (${item.code})` }
  })
  return (
    <div className='mx-5'>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Order Booker</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Order Booker Name </label>
              <input
                type="text"
                {...register("OrderBookerName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
           
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Region </label>
              <Select onChange={(val) => setPrRegion(val.value)} options={Regiondrp} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Address </label>
              <input
                type="text"
                {...register("Address")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Cnic </label>
              <input
                type="text"
                {...register("Cnic")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Phone Number </label>
              <input
                type="text"
                {...register("PhoneNumber")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Order Booker
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OderBookerAdd