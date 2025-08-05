import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import { generateNextCodeForCat } from '../../Global/GenrateCode';

const CityAdd = () => {
  const navigate = useNavigate()
  const Region = useSelector((state) => state.Region.Region)
  const [selectRegion , setSelectRegion] = useState('')

  const RegionDrp = Region.map((item) => ({
    value: item._id,
    label: item.RegionName
  }))

  const {
    register,
    handleSubmit,
    formState: { errors },

  } = useForm();
  const onSubmit = async (data) => {
    const code = await getDataFundtion(`/City/getLastByVendor/0`)
    console.log(code.data)
    code.data.length == 0 ? data.code = generateNextCodeForCat('00') : data.code = generateNextCodeForCat(code.data.slice(-1)[0].code)
    data.Region = selectRegion
    console.log(data)

    try {
      const res = await createDataFunction('/City', data)
      console.log(res)
      toast.success("Data Add")
      setTimeout(() => {
        navigate("/Citylist")
      }, 2000);
    } catch (err) {
      toast.success("Some thing went Wrong")

    }
  }
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add City</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">City Name</label>
              <input
                type="text"
                {...register("CityName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Region</label>
              <Select onChange={(v) => setSelectRegion(v.value)} options={RegionDrp} placeholder="select zone" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add City
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CityAdd