import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions'

const ChannelEdit = () => {
  const { id } = useParams()
  const editChannelType = useSelector((state) => state.Channel.channel)
  console.log(editChannelType)
  const ChannelType = useSelector((state) => state.ChannelType.channelType)

  const [editCat, seteditCat] = useState([])
  const [CtypeSelect, setCtypeSelect] = useState(undefined)
  const getData = () => {
    const data = editChannelType.find((item) => item._id == id)
    seteditCat(data)
    const selectCType = ChannelType.find((item) => item._id == data.ChanneType)
    console.log(selectCType)
    setCtypeSelect({
      value: selectCType._id,
      label: `${selectCType.ChanneTypeName} ${selectCType.code} `
    })

    if (data) {
      reset({
        ChanneName: data.ChanneName,
        salesFlowRef: data.salesFlowRef,
      })
    }

  }
  const Channeldrp = ChannelType.map((item) => {
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
      updateDataFunction(`/Channel/updateChannel/${id}`, data)
      toast.success("Data Edit")
      setTimeout(() => {
        navigate('/ChannelList')
      }, 2000);
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Category</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Channel Name </label>
              <input
                type="text"
                {...register("ChanneName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Channel  </label>
              <Select
                value={CtypeSelect}
                isDisabled={true} onChange={(val) => setPrChannel(val.value)} options={Channeldrp} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                Edit Channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChannelEdit