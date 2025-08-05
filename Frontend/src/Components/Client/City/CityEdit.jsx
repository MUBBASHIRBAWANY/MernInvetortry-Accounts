import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions';

const CityEdit = () => {
    const { id } = useParams()
    const editCity = useSelector((state) => state.City.City)
    console.log(editCity)

    const Region = useSelector((state) => state.Region.Region)
    const [selectRegion, setSelectRegion] = useState('')

    const RegionDrp = Region.map((item) => ({
        value: item._id,
        label: item.RegionName
    }))

    const getData = () => {
        const data = editCity.find((item) => item._id == id)
        setSelectRegion(data.Region)
        if (data) {
            reset({
                CityName: data.CityName,
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
            await updateDataFunction(`/City/updateCity/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/CityList')
            }, 2000);
        } catch (err) {
            toast.error("Some Thing Went Wrong")

        }
    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit City </h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">City Name </label>
                            <input
                                type="text"
                                {...register("CityName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Region</label>
                            <Select onChange={(v) => setSelectRegion(v.value)} options={RegionDrp} isDisabled={true

                                
                            } placeholder="select zone" value={selectRegion ? {
                                value: Region.find((item) => item._id === selectRegion)._id,
                                label: Region.find((item) => item._id === selectRegion).RegionName
                            } : null} />
                        </div>

                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit City
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CityEdit