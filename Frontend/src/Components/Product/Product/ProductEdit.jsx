import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { updateDataFunction } from '../../../Api/CRUD Functions'

const ProductEdit = () => {
    const { id } = useParams();
    const pageName = "ProductEdit"
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [pRSku, setPRSku] = useState(null)
    const [defultSku, setDefultSku] = useState(undefined)
    const [prBrand, setPrBrand] = useState(null)
    const [cat, setCat] = useState(null)
    const [productData, setProductData] = useState([])
    const Product = useSelector((state) => state.Product.product)
    const Vendor = useSelector((state) => state.Vendor.state)
    const MasterSku = useSelector((state) => state.MasterSku.MasterSku)
    const Brand = useSelector((state) => state.Brand.brand)
    const Category = useSelector((state) => state.Category.category)
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)


    const MasterSkudrp = MasterSku.map((item) => {
        return { value: item._id, label: `${item.MasterSkuName} (${item.mastercode})` }
    })

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const getData = () => {
        if (!Product || !MasterSku.length) {
            navigate("/ProductList")
            return
        }
        const findProduct = Product.find((item) => item._id == id)
        if (!findProduct) {
            navigate("/ProductList")
            return
        }

        setProductData(findProduct)
        const selectedMasterSku = MasterSku.find((val) => val._id == findProduct.MasterSKu);

        if (selectedMasterSku) {
            setDefultSku({
                value: selectedMasterSku._id,
                label: `${selectedMasterSku.MasterSkuName} (${selectedMasterSku.mastercode})`
            });

            const category1 = Category.find((item) => item.mastercode == selectedMasterSku.mastercode.slice(0, 4))?.CategoryName;
            setCat(category1 || "");
        }
        console.log(findProduct)
        reset({
            ProductName: findProduct.ProductName,
            OpeningRate: findProduct.OpeningRate,
            TPPurchase: findProduct.TPPurchase,
            TPSale: findProduct.TPSale,
            SaleTaxBy: findProduct.SaleTaxBy,
            SalesTax: findProduct.SaleTaxAmount || findProduct.SaleTaxPercent,
            BoxinCarton: findProduct.BoxinCarton,
            PcsinBox: findProduct.PcsinBox,
            RetailPrice: findProduct.RetailPrice,
            salesFlowRef: findProduct.salesFlowRef
        });
    }

    const onSubmit = async (data) => {

        if (data.SaleTaxBy == 2) {
            if (data.SalesTax > 99) {
                return toast.error("Tax Rate Must be less The hundred")
            }
        }
        try {
            data.SaleTaxBy == 1 ? data.SaleTaxAmount = data.SalesTax : data.SaleTaxPercent = data.SalesTax
            console.log(data)

            await updateDataFunction(`/product/updateProduct/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/ProductList')
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
        getData()
        checkAcess()
    }, [id, Product, MasterSku, Vendor, Brand, Category])

    console.log(defultSku)
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Product</h1>
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
                            <label className="block text-gray-700 font-semibold mb-2">Master Sku </label>
                            <Select
                                value={defultSku}
                                onChange={(val) => setPRSku(val.value)}
                                options={MasterSkudrp}
                                isDisabled={true}
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
                                {...register("SalesTax")}
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
                        <label className="block text-gray-700 font-semibold mb-2"> Category = {cat} </label>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Product
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ProductEdit