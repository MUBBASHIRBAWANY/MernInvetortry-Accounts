import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions'

const SubChannelEdit = () => {
  const { id } = useParams()
    const subChenal = useSelector((state) => state.subChannel.subChannel)
    console.log(subChenal)
    const Channel = useSelector((state) => state.Channel.channel)
  
    const [editCat, seteditCat] = useState([])
    const [SelectChenal, setSelectChenal] = useState(undefined)
    const getData = () => {
      const data = subChenal.find((item) => item._id == id)
      seteditCat(data)
      const selectCType = Channel.find((item) => item._id == data.Channel)
      console.log(selectCType)
      setSelectChenal({
        value: selectCType._id,
        label: `${selectCType.ChanneName} ${selectCType.code} `
      })
  console.log(SelectChenal)
      if (data) {
        reset({
          SubChanneName: data.SubChanneName,
          salesFlowRef: data.salesFlowRef,
        })
      }
  
    }
    const Channeldrp = Channel.map((item) => {
      return { value: item._id, label: `${item.ChanneTypeName} (${item.code})` }
    })
    
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
        updateDataFunction(`/SubChannel/updateSubChannel/${id}`, data)
        toast.success("Data Edit")
        setTimeout(() => {
          navigate('/SubChannellist')
        }, 2000);
      } catch (err) {
        console.log(err)
      }
    }
  return (
   <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Sub Channel</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sub Channel Name </label>
              <input
                type="text"
                {...register("SubChanneName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref </label>
              <input
                type="text"
                {...register("salesFlowRef")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Channel  </label>
              <Select
                value={SelectChenal}
                isDisabled={true} onChange={(val) => setPrChannel(val.value)} options={Channeldrp} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Sub Channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SubChannelEdit