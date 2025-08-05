import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const ZoneAdd = () => {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },

  } = useForm();
  const vendor = useSelector((state) => state.Vendor.state)
  const [prVendor, setPrVendor] = useState("")
  const Vendordrp = vendor.map((item) => {
    return { value: item._id, label: `${item.VendorName} (${item.code})` }
  })
  const onSubmit = async (data) => {
    const code = await getDataFundtion(`/Zone/lastCode`)
    console.log(code.data)
    code.data == null ? data.code = generateNextCodeForCat('00') : data.code = generateNextCodeForCat(code.data.code)
    console.log(data)
    data.vendor = prVendor
    try {
      const res = await createDataFunction('zone/', data)
      console.log(res)
      toast.success("Data Add")
      setTimeout(() => {
        navigate("/Zonelist")
      }, 2000);
    } catch (err) {
      toast.success("Some thing went Wrong")

    }
  }
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Zone</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Zone Name</label>
              <input
                type="text"
                {...register("ZoneName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Zone
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ZoneAdd