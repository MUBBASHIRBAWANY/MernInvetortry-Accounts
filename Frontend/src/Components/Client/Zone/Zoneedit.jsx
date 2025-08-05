import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions';

const Zoneedit = () => {
    const { id } = useParams()
    const editZone = useSelector((state) => state.Zone.zone)

    const Vendor = useSelector((state) => state.Vendor.state)
    const [editCat, seteditCat] = useState([])
    const [vendorSelect, setSelectVendor] = useState(undefined)
    const getData = () => {
        const data = editZone.find((item) => item._id == id)

        seteditCat(data)
   
        if (data) {
            reset({
                ZoneName: data.ZoneName,
                code1: data.code,
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
            await updateDataFunction(`/zone/UpdateZone/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/ZoneList')
            }, 2000);
        } catch (err) {
            toast.error("Some Thing Went Wrong")

        }
    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edic Category</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Zone Name </label>
                            <input
                                type="text"
                                defaultValue={editCat.CategoryName}
                                {...register("ZoneName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">code </label>
                            <input
                                type="text"
                                disabled={true}
                                {...register("code1")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Zone
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Zoneedit