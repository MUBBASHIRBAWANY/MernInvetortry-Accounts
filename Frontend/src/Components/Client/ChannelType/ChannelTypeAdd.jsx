import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import { getDataFundtion, createDataFunction } from '../../../Api/CRUD Functions';

const ChannelTypeAdd = () => {
  const {
          register,
          handleSubmit,
          formState: { errors },
  
      } = useForm();
      const navigate = useNavigate()
      const UserRihts = useSelector((state) => state.UsersRights.UserRights)
      const Vendor = useSelector((state) => state.Vendor.state)
      const pageName = "CategoryAdd"
      const [prVendor, setPrVendor] = useState("")
      const checkAcess = async () => {
          console.log(UserRihts)
          const allowAcess = await UserRihts.find((item) => item == pageName)
          console.log(allowAcess)
          if (!allowAcess) {
              navigate("/")
          }
      }
      useEffect(() => {
          checkAcess()
      }, [])
      const onSubmit = async (data) => {
  
          let getCatByVendor = await getDataFundtion(`/chanelType/ChannelTypeByvendor/0`)
          data.vendor = prVendor
          getCatByVendor.data.length == 0 ? data.code = generateNextCodeForCat(getCatByVendor.data.length) : data.code = generateNextCodeForCat(getCatByVendor.data.slice(-1)[0].code)
          console.log(data)
          try {
  
              await createDataFunction("/chanelType", data)
              toast.success("Data Add")
              setTimeout(() => {
                  navigate('/ChannelTypelist')
              }, 2000);
  
          } catch (err) {
              console.log(err)
          }
  
      }
      const Vendordrp = Vendor.map((item) => {
          return { value: item._id, label: `${item.VendorName} (${item.code})` }
      })
  return (
    <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Channel Type</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Channel Name </label>
                            <input
                                type="text"
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
                                Add Channel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default ChannelTypeAdd