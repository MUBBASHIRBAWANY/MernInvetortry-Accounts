import Select from 'react-select'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDataFunction } from '../../../Api/CRUD Functions';


const RegionEdit = () => {
  const { id } = useParams()
  const editRegion = useSelector((state) => state.Region.Region)
  const Zone = useSelector((state) => state.Zone.zone)
  const [editReg, seteditReg] = useState([])
  const ZoneDrp = Zone.map((item) => ({
    value: item._id,
    label: item.ZoneName
  }))


  const [selectZone, setSelectzone] = useState(undefined)
  const getData = () => {
    const data = editRegion.find((item) => item._id == id)
    console.log(data)
    setSelectzone(data.Zone)
    seteditReg(data)
    const selectZone = Zone?.find((item) => item._id == data?.Zone)
    console.log(selectZone)

    if (data) {
      reset({
        RegionName: data.RegionName,
        salesFlowRef: data.salesFlowRef,
      })
    }

  }
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const pageName = "CategoryEdit"
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
      updateDataFunction(`/Region/UpdateRegion/${id}`, data)
      toast.success("Data Edit")
      setTimeout(() => {
        navigate('/RegionList')
      }, 2000);
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Region</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Region Name </label>
              <input
                type="text"
                defaultValue={editReg.RegionName}
                {...register("RegionName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Zone</label>
              <Select value={selectZone ? {
                  value : Zone.find((item)=> item._id === selectZone)._id,
                  label :  Zone.find((item)=> item._id === selectZone).ZoneName
              } : null} onChange={(v) => setSelectzone(v.value)} options={ZoneDrp} isDisabled={true} defaultValue={selectZone} placeholder="select zone" />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Region
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegionEdit