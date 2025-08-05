import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import { getDataFundtion, createDataFunction } from '../../../Api/CRUD Functions';



const CategoryAdd = () => {
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

        let getCatByVendor = await getDataFundtion(`/Category/catByvendor/${prVendor}`)
        data.vendor = prVendor
        getCatByVendor.data.length == 0 ? data.code = generateNextCodeForCat(getCatByVendor.data.length) : data.code = generateNextCodeForCat(getCatByVendor.data.slice(-1)[0].code)
        data.mastercode = Vendor.find((item) => item._id == prVendor).code + data.code
        data.CodeRef = Vendor.find((item) => item._id == prVendor).ShortCode + data.salesFlowRef
        console.log(data)
        try {

            await createDataFunction("/Category", data)
            toast.success("Data Add")
            setTimeout(() => {
                navigate('/CategoryList')
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
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Category</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Category Add </label>
                            <input
                                type="text"
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
                            <Select onChange={(val) => setPrVendor(val.value)} options={Vendordrp} />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CategoryAdd