import Select from 'react-select'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDataFunction } from '../../../Api/CRUD Functions';


const CategoryEdit = () => {
    const { id } = useParams()
    const editCategory = useSelector((state) => state.Category.category)
    const Vendor = useSelector((state) => state.Vendor.state)
    const [editCat, seteditCat] = useState([])
    const [vendorSelect, setSelectVendor] = useState(undefined)
    const getData = () => {
        const data = editCategory.find((item) => item._id == id)
        seteditCat(data)
        const selectVen = Vendor.find((item) => item._id == data.vendor)
        console.log(selectVen)
        setSelectVendor({
            value: selectVen._id,
            label: `${selectVen.VendorName} ${selectVen.code} `
        })
        if (data) {
            reset({
                CategoryName: data.CategoryName,
                salesFlowRef : data.salesFlowRef,
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
            updateDataFunction(`/Category/updateCategory/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/CategoryList')
            }, 2000);
        } catch (err) {
            console.log(err)
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
                            <label className="block text-gray-700 font-semibold mb-2">Category Edit </label>
                            <input
                                type="text"
                                defaultValue={editCat.CategoryName}
                                {...register("CategoryName")}
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
                            <label className="block text-gray-700 font-semibold mb-2">Vendor </label>
                            <Select
                                value={vendorSelect}
                                options={vendorSelect}
                                isDisabled={true}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CategoryEdit