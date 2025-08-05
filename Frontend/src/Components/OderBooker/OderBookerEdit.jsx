import Select from 'react-select'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';


const OderBookerEdit = () => {
  const { id } = useParams()
  const editOrderBooker = useSelector((state) => state.OrderBooker.OrderBooker)
  const Terrotory = useSelector((state) => state.Terrotory.Terrotory)
  const [editCat, seteditCat] = useState([])
  const [TerrotorySelect, setSelectTerrotory] = useState(undefined)
  const getData = () => {
    const data = editOrderBooker.find((item) => item._id == id)
    console.log(data)
    seteditCat(data)
    const selectVen = Terrotory.find((item) => item._id == data.Terrotory)
    console.log(selectVen)
    setSelectTerrotory({
      value: selectVen._id,
      label: `${selectVen.TerrotoryName} ${selectVen.code} `
    })
    if (data) {
      reset({
        OrderBookerName: data.OrderBookerName,
        salesFlowRef: data.salesFlowRef,
        Address: data.Address,
        Cnic: data.Cnic,
        PhoneNumber: data.PhoneNumber
      })
    }

  }
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const pageName = "OrderBookerEdit"
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
      updateDataFunction(`/OrderBooker/updateOrderBooker/${id}`, data)
      toast.success("Data Edit")
      setTimeout(() => {
        navigate('/OrderBookerList')
      }, 2000);
    } catch (err) {
      console.log(err)
    }
  }
  const Terrotorydrp = Terrotory.map((item) => {
    return { value: item._id, label: `${item.TerrotoryName} (${item.code})` }
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
              <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref </label>
              <input
                type="text"
                {...register("salesFlowRef")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Terrotory </label>
              <Select isDisabled={true} value={TerrotorySelect} onChange={(val) => setPrTerrotory(val.value)} options={Terrotorydrp} />
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
                Edit Order Booker
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OderBookerEdit