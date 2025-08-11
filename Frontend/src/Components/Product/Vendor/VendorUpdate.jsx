import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { data, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions';


const VendorUpdate = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const vendorEdit = useSelector((state) => state)
    const allVender = vendorEdit.Vendor.state
    const Store = useSelector((state) => state.Store.Store)
    const [findvendor, setFindvendor] = useState(null)
    const [activeTab, setActiveTab] = useState('basic');
    const [defultStore, setdefultStore] = useState([])
    const [changeStore, setChangeStore] = useState("")
    const [selectStore, setSelectStore] = useState("")

    const { register, handleSubmit, reset } = useForm()


    const AllStore = Store.map((item) => {
        return {
            value: item._id,
            label: item.StoreName
        }
    })
    const getData = () => {
        const ven = allVender.find((item) => item._id == id)
        setFindvendor(ven)
        console.log(ven)
        if (ven) {
            reset({
                VendorName: ven.VendorName,
                phone: ven.phone,
                email: ven.email,
                Address: ven.Address,
                NTN: ven.NTN,
                STN: ven.STN,
                Fax: ven.Fax,
                salesFlowRef: ven.salesFlowRef,
                WebSite: ven.WebSite,
                ContactPerson: ven.ContactPerson,
                PurchaseDate: ven.PurchaseDate,
                DepPercent: ven.DepPercent,
                TargetedDiscountPercent: ven.TargetedDiscountPercent,
                TargetedDiscount: ven.TargetedDiscount,
                CashDiscountPercent: ven.CashDiscountPercent,
                CashDiscountAmount: ven.CashDiscountAmount,
                AdvanceDiscountAmount: ven.AdvanceDiscountAmount,
                AdvanceDiscountPercent: ven.AdvanceDiscountPercent,
                ShortCode: ven.ShortCode



            })
        }
    }

    const pageName = "Edit Vendor"
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const checkAcess = async () => {
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
            navigate("/")
        }
    }


    useEffect(() => {
        checkAcess()
         
        getData()
    }, [id, allVender ])

    useEffect(() => {
        if (findvendor) {
            const selectedStores = findvendor.Store.map((storeId) => {
                const store = Store.find((store) => store._id === storeId);
                return {
                    value: store?._id,
                    label: store?.StoreName
                }
            });
            setdefultStore(selectedStores);
            setChangeStore(selectedStores);
            const values = selectedStores.map(option => option.value);
            setSelectStore(values);
        }
    }, [findvendor, Store]);
    
    const onSubmit = async (data) => {
        data.Store = selectStore
        console.log(data)
        try {
            const res = await updateDataFunction(`/vendor/updateVendor/${id}`, data)
            console.log(res)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate("/VendorList")
            }, 2000);
            

        } catch (error) {
            toast.error("Error updating vendor")
            console.error(error)
        }
    }
    const StoreChnge = (id) => {
        
        setChangeStore(id)
        const values = (id || []).map(option => option.value);
        setSelectStore(values)
    }
    
    
    if (!findvendor) return <div>Loading...</div>
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Vendor</h1>
                <ToastContainer />
                <div className="mb-4">
                    <div className="flex border-b border-gray-200">
                        <div className="flex border-b border-gray-200">
                            <button
                                type="button"
                                className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'basic'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('basic')}
                            >
                                Basic Info
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'financial'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('financial')}
                            >
                                Financial Details
                            </button>
                            <button
                                type="button"
                                className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'discounts'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                    }`}
                                onClick={() => setActiveTab('discounts')}
                            >
                                Discounts
                            </button>
                        </div>
                    </div>
                </div>

                <form className="bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Short Code</label>
                                <input
                                    type="text"
                                    {...register("ShortCode")}
                                    maxLength={3}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    disabled={true}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Vendor Name</label>
                                <input
                                    type="text"
                                    {...register("VendorName")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref</label>
                                <input
                                    type="text"
                                    {...register("salesFlowRef")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                                <input
                                    type="text"
                                    {...register("phone")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                                <input
                                    type="email"
                                    {...register("email")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                                <input
                                    type="text"
                                    {...register("Address")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">NTN</label>
                                <input
                                    type="text"
                                    {...register("NTN")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">STN</label>
                                <input
                                    type="text"
                                    {...register("STN")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Fax</label>
                                <input
                                    type="text"
                                    {...register("Fax")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">WebSite</label>
                                <input
                                    type="text"
                                    {...register("WebSite")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Contact Person</label>
                                <input
                                    type="text"
                                    {...register("ContactPerson")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Purchase Date</label>
                                <input
                                    type="Date"
                                    {...register("PurchaseDate")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2"> Vendor </label>
                                <Select
                                    isMulti
                                    defaultValue={defultStore}
                                    options={AllStore}
                                    value={changeStore}
                                    onChange={(val) => StoreChnge(val)}
                                />
                            </div>
                        </div>
                    )}

                    {/* Financial Details Tab */}
                    {activeTab === 'financial' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Zone A/c</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Department</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Transport</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Price List</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Transport</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Dep Exp A/c</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Acc Dep Exp A/c</label>
                                <Select />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Dep %</label>
                                <input
                                    type="text"
                                    {...register("DepPercent")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    {/* Discounts Tab */}
                    {activeTab === 'discounts' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Targeted Discount Percent</label>
                                <input
                                    type="text"
                                    {...register("TargetedDiscountPercent")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Targeted Discount Amount</label>
                                <input
                                    type="text"
                                    {...register("TargetedDiscount")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Cash Discount Percent</label>
                                <input
                                    type="text"
                                    {...register("CashDiscountPercent")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Cash Discount Amount</label>
                                <input
                                    type="text"
                                    {...register("CashDiscountAmount")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Advance Discount Amount</label>
                                <input
                                    type="text"
                                    {...register("AdvanceDiscountAmount")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Advance Discount %</label>
                                <input
                                    type="text"
                                    {...register("AdvanceDiscountPercent")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end">
                        {activeTab !== 'basic' && (
                            <button
                                type="button"
                                className="mr-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                onClick={() => setActiveTab(activeTab === 'financial' ? 'basic' : 'financial')}
                            >
                                Previous
                            </button>
                        )}
                        {activeTab !== 'discounts' && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={() => setActiveTab(activeTab === 'basic' ? 'financial' : 'discounts')}
                            >
                                Next
                            </button>
                        )}
                        {activeTab === 'discounts' && (
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Vendor
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>

    )
}

export default VendorUpdate