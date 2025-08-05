import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForProduct } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';


const ProductAdd = () => {
    const pageName = "ProductAdd"
    const MasterSku = useSelector((state) => state.MasterSku.MasterSku)
    const Vendor = useSelector((state) => state.Vendor.state)
    const Brand = useSelector((state) => state.Brand.brand)
    const Category = useSelector((state) => state.Category.category)
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const [pRSku, setPRSku] = useState(null)
    const [prVendor, setPrVendor] = useState(null)
    const [prBrand, setPrBrand] = useState(null)
    const [Cat, setCat] = useState("")

    const MasterSkudrp = MasterSku.map((item) => {
        return { value: item._id, label: `${item.MasterSkuName}  (${item.mastercode})` }
    })

    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();

    const changing = (id, name) => {
        setPRSku(id)
        console.log(name)
        const lastword = name.slice(-9, -5)
        console.log(lastword)
        const findcat = Category.find((item) => item.mastercode == lastword)?.CategoryName
        console.log(findcat)
        setCat(findcat)
    }
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        console.log(data)
        if (data.SaleTaxBy == 2) {
            if (data.SalesTax > 99) {
                return toast.error("Tax Rate Must be less The hundred")
            }
        }
        try {
            const lastCode = await getDataFundtion(`product/lastcode/`)
            console.log(lastCode)
            lastCode.data === null ? data.code = generateNextCodeForProduct(0) : data.code = generateNextCodeForProduct(lastCode.data.code)
            console.log(data)
            await createDataFunction("/product", data)
            toast.success("Data Add")
            setTimeout(() => {
                navigate('/ProductList')
            }, 2000);

        } catch (err) {
            console.log(err)
            toast.error("some thing went wrong")
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
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Product</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Product Name </label>
                            <input
                                type="text"
                                {...register("ProductName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Opening Rate </label>
                            <input
                                type="text"
                                {...register("OpeningRate")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> (TP) Purcahsae</label>
                            <input
                                type="text"
                                {...register("TPPurchase")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> (TP) Sale </label>
                            <input
                                type="text"
                                {...register("TPSale")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Retail Price </label>
                            <input
                                type="text"
                                {...register("RetailPrice")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Sales Tax By </label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("SaleTaxBy")}>
                                <option value="1">By Trade Price</option>
                                <option value="2">By Retail Price </option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Sales Tax </label>
                            <input
                                type="text"
                                {...register("SaleTaxPercent")}
                                maxLength={2}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Boxes in Carton </label>
                            <input
                                type="text"
                                {...register("BoxinCarton")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Pisces in Box </label>
                            <input
                                type="text"
                                {...register("PcsinBox")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Sku
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductAdd