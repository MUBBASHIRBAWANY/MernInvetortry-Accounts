import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions';

const TerrotoryEdit = () => {
  const { id } = useParams()
  const editTerrotory = useSelector((state) => state.Terrotory.Terrotory)

  const [selectCity, setSelectCity] = useState('')
  const City = useSelector((state) => state.City.City)
  const CityDrp = City.map((item) => ({
    value: item._id,
    label: item.CityName
  }))

  const [editCat, seteditCat] = useState([])

  const getData = () => {
    const data = editTerrotory.find((item) => item._id == id)
    setSelectCity(data.City)
    seteditCat(data)


    if (data) {
      reset({
        TerrotoryName: data.TerrotoryName,
        salesFlowRef: data.salesFlowRef,
      })
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
      await updateDataFunction(`/Terrotory/UpdateTerrotory/${id}`, data)
      toast.success("Data Edit")
      setTimeout(() => {
        navigate('/TerrotoryList')
      }, 2000);
    } catch (err) {
      toast.error("Some Thing Went Wrong")

    }
  }
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Terrotory</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Terrotory Name </label>
              <input
                type="text"
                defaultValue={editCat.CategoryName}
                {...register("TerrotoryName")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">City</label>
              <Select onChange={(v) => setSelectCity(v.value)} value={selectCity ? {
                value: City.find((item) => item._id === selectCity)._id,
                label: City.find((item) => item._id === selectCity).CityName
              } : null} options={CityDrp} placeholder="select city" isDisabled={true} />
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Terrotory
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default TerrotoryEdit