import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const BrandAdd = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();
    const pageName = "BrandAdd"
    const navigate = useNavigate()
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const category = useSelector((state) => state.Category.category)
    const [prCat, setprCat] = useState(null)

    const CategoryDrp = category.map((item) => {
        return { value: item._id, label: `${item.CategoryName} (${item.code})` }
    }
    )

    const onSubmit = async (data) => {
        if (!prCat) {
            return toast.error("Category is Required")
        }
        try {
            const brandbycat = await getDataFundtion(`brand/getBrandByCat/${prCat}`)
            console.log(brandbycat.data)
            brandbycat.data.length == 0 ? data.code = generateNextCodeForCat(brandbycat.data.length) : data.code = generateNextCodeForCat(brandbycat.data.slice(-1)[0].code)
            data.mastercode = category.find((item) => item._id === prCat).mastercode + data.code
            data.category = prCat
            data.CodeRef = (category.find((item) => item._id === prCat).CodeRef).slice(0 , 3) + data.salesFlowRef
            console.log(data)

            await createDataFunction("/brand", data)
            toast.success("Data Add")
            setTimeout(() => {
                navigate('/brandList')
            }, 2000);

        } catch (err) {
            console.log(err)
        }

    }
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
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Brand</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Brand Add </label>
                            <input
                                type="text"
                                {...register("BrandName")}
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
                            <label className="block text-gray-700 font-semibold mb-2">Category</label>
                            <Select onChange={(val) => setprCat(val.value)} options={CategoryDrp} />
                        </div>

                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Brand
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BrandAdd