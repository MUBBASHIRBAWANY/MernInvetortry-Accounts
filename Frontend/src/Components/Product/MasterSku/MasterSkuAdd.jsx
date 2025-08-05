import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForMsku } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';


const MasterSkuAdd = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();
    const navigate = useNavigate()
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const Brand = useSelector((state) => state.Brand.brand)
    const [prBrand, setPrBrand] = useState(null)
    const Branddrp = Brand.map((item) => {
        return { value: item._id, label: `${item.BrandName} (${item.code})` }
    })
    const pageName = "MasterSkuAdd"
    const onSubmit = async (data) => {
        if (!prBrand) {
            return toast.error("Brand is Requried")
        }
        try {
            const Brand1 = await getDataFundtion(`masterSku/mskubybrand/${prBrand}`)
            console.log(Brand1.data)
            Brand1.data.length == 0 ? data.code = generateNextCodeForMsku(Brand1.data.length) : data.code = generateNextCodeForMsku(Brand1.data.slice(-1)[0].code)
            console.log(Brand)
            data.mastercode = Brand.find((item) => item._id == prBrand).mastercode + data.code
            data.Brand = prBrand
            data.CodeRef = (Brand.find((item) => item._id == prBrand).CodeRef).slice(0, 5) + data.salesFlowRef
            console.log(data)
            const res = await createDataFunction("/MasterSku/", data)
            toast.success("Data Add")
            setTimeout(() => {
                navigate('/masterskulist')
            }, 2000);
            console.log(data)
        }
        catch (err) {
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
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Master Sku</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Master Sku Add </label>
                            <input
                                type="text"
                                {...register("MasterSkuName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Sales Flow Ref </label>
                            <input
                                type="text"
                                {...register("salesFlowRef")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Brand</label>
                            <Select onChange={(val) => setPrBrand(val.value)} options={Branddrp} />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Master Sku
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default MasterSkuAdd