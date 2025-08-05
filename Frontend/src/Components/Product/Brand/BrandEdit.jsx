import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions';


const BrandEdit = () => {
    const { id } = useParams()
    const editCategory = useSelector((state) => state.Brand.brand)
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const category = useSelector((state) => state.Category.category)
    const [selectCat , setSelectCat] = useState(undefined)
    const pageName = "BrandEdit"
    console.log(editCategory)
    const [editbrand, seteditbrand] = useState([])
    const getData = () => {
        const data = editCategory.find((item) => item._id == id)
        const defultCat = category.find((item) => item._id == data.category)
        setSelectCat({
            value : defultCat._id,
            label : `${defultCat.CategoryName}  ${defultCat.mastercode}`
        })

        seteditbrand(data)
        if (data) {
            reset({
                BrandName: data.BrandName,
                salesFlowRef : data.salesFlowRef
            })
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
            await updateDataFunction(`/brand/updateBrand/${id}`, data)
            
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/brandList')
            }, 2000);
        } catch (err) {
            console.log(err)
        }
        console.log(data)
    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Brand</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Brand Name </label>
                            <input
                                type="text"
                                defaultValue={editbrand.BrandName}
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
                            <Select value={selectCat} isDisabled={true} />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Brand
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default BrandEdit