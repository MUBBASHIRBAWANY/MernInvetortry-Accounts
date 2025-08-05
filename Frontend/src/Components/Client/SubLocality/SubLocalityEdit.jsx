import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions';


const SubCityEdit = () => {
  const { id } = useParams()
    const editSubCity = useSelector((state) => state.SubCity.SubCity)
    console.log(editSubCity)

    const City = useSelector((state) => state.City.City)
    const [editCat, seteditCat] = useState([])
    const [CitySelect, setSelectCity] = useState(undefined)
    const getData = () => {
        const data = editSubCity.find((item) => item._id == id)
        seteditCat(data)
        const selectVen = City.find((item) => item._id == data.City)
        console.log(selectVen)
        setSelectCity({
            value: selectVen._id,
            label: `${selectVen.CityName} ${selectVen.code} `
        })
        if (data) {
            reset({
                SubCityName: data.SubCityName,
                SaleFlowRef: data.SaleFlowRef,
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
            await updateDataFunction(`/SubCity/updateSubCity/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/SubCityList')
            }, 2000);
        } catch (err) {
            toast.error("Some Thing Went Wrong")

        }
    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Sub City </h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sub City Name </label>
                            <input
                                type="text"
                                defaultValue={editCat.SubCityName}
                                {...register("SubCityName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref </label>
                            <input
                                type="text"
                                {...register("SaleFlowRef")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">City </label>
                            <Select
                                value={CitySelect}
                                options={CitySelect}
                                isDisabled={true}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Sub City
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default SubCityEdit