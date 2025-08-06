import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCustomer } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { getDataFundtion, createDataFunction } from '../../../Api/CRUD Functions';

const ClientAdd = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('basic');
    const pageName = "CustomerAdd"
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const Vendor = useSelector((state) => state.Vendor.state)
    const Region = useSelector((state) => state.Region.Region)
    const Terrotory = useSelector((state) => state.Terrotory.Terrotory)
    const Zone = useSelector((state) => state.Zone.zone)
    const City = useSelector((state) => state.City.City)
    const [SelectVendor, setSelectVendor] = useState([])
    const [selectZone, setSelectZone] = useState('')
    const [SelectRegion, setSelectRegion] = useState('')
    const [SelectChannel, setSelectChannel] = useState('')
    const [SelectSubChannel, setSelectSubChannel] = useState('')
    const [SelectChannelType, setChannelType] = useState('')
    const [SelectTerrotory, setSelectTerrotory] = useState('')
    const [changeVendor, setchangeVendor] = useState('')
    const [selectCity, setSelectCity] = useState('')
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
    const filteredAccount = Account.filter((item) => item.AccountCode.length === 5)
    const CustomerAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)
    const [CustomerAccounts, setCustomerAccounts] = useState('')
    const [CityTerrotory, setCityTerrotory] = useState([])
    const [ZoneRegion, setZoneRegion] = useState([])
    const [RegionCity, setRegionCity] = useState([])

    const result = [];
    for (let i = CustomerAccountNumber.CustomerFrom; i <= CustomerAccountNumber.CustomerFrom; i++) {
        result.push(i.toString().padStart(5, '0'));
    }


    const CustomerSeries = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))
    const CustomerSeriesDrp = CustomerSeries.map((item) => ({
        value: item._id,
        label: `${item.AccountCode} ${item.AccountName}`
    }))




    const CityDrp = City.map((item) => {
        return ({
            value: item._id,
            label: `${item.CityName} ${item.code}`,
            code: item.code
        })
    })

    const setDrp = (feild, value) => {
        console.log(value)
        setSelectCity(value)
        const cit = City.find((item) => item._id === value.value)
        const Reg =  Region.find((item) => item._id === cit.Region)
        const Zon = Zone.find((item)=> item._id === Reg.Zone)
        setSelectRegion(Reg)
        setSelectZone(Zon)
    }



    const checkAcess = async () => {
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
            navigate("/")
        }
    }
    const ChenalTypeOp = [
        {
            label: "Whole Saller",
            value: "1"
        },
        {
            label: "Retailer",
            value: "2"
        },
    ]
    useEffect(() => {
        checkAcess()
    }, [])
    const onSubmit = async (data) => {
        const lastCode = await getDataFundtion(`/customer/lastCustomor`)
        console.log(lastCode.data)
        lastCode.data == null ? data.code = "0001" : data.code = generateNextCodeForCustomer(lastCode.data.code)
        data.Region = SelectRegion._id
        data.Zone = selectZone._id
        data.City = selectCity.value
        data.Stage3 = CustomerAccounts.value
        data.Stage = "4"
        data.AccountName = data.CutomerName
        data.masterCode = Account.find((item) => item._id == CustomerAccounts.value).AccountCode
        data.Stage1 = Account.find((item) => item._id == CustomerAccounts.value).Stage1
        data.Stage2 = Account.find((item) => item._id == CustomerAccounts.value).Stage2
        console.log(data)
        try {
            const createAccout = await createDataFunction('/ChartofAccounts', data)
            data.AccountCode = createAccout.data.AccountCode
            const res = await createDataFunction('/customer', data)
            console.log(res)
            toast.success("Data Add")
            setTimeout(() => {
                navigate('/clientList')
            }, 2000);


        } catch (err) {
            toast.error("Some Thing Went Wrong")
        }


    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Customer</h1>
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

                        </div>
                    </div>
                </div>

                <form className="bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* Basic Info Tab */}
                    {activeTab === 'basic' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Client Series Account</label>
                                <Select options={CustomerSeriesDrp} onChange={(e) => setCustomerAccounts(e)} />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
                                <input
                                    type="text"
                                    {...register("CutomerName")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

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
                                <label className="block text-gray-700 font-semibold mb-2">Owner Name</label>
                                <input
                                    type="text"
                                    {...register("ShopOwner")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Owner Cnic</label>
                                <input
                                    type="text"
                                    {...register("OwnerCnic")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Shop Register Date</label>
                                <input
                                    type="Date"
                                    {...register("ShopRegisterDate")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                />
                            </div>
                        </div>
                    )}

                    {/* Financial Details Tab */}
                    {activeTab === 'financial' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">City</label>
                                <Select options={CityDrp} onChange={(val) => setDrp("City", val)} />
                            </div>


                            <div>
                                <label className="block text-gray-700 font-semibold mb-2"> Advance Tax Apply </label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("AdvanceTaxApply")}>
                                    <option value="1">Yes</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2"> Filler </label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("Filler")}>
                                    <option value="1">Filler</option>
                                    <option value="2">Non-Filler</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2"> Registered </label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("Registered")}>
                                    <option value="1">Registered</option>
                                    <option value="2">Un Registered</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2"> Status </label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("Status")}>
                                    <option value="1">Active</option>
                                    <option value="2">non Active</option>
                                </select>
                            </div>
                        </div>
                    )}


                    <div className="mt-6 flex justify-end">
                        {activeTab !== 'basic' && (
                            <button
                                type="button"
                                className="mr-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                                onClick={() => setActiveTab(activeTab === 'financial' ? 'basic' : 'basic')}
                            >
                                Previous
                            </button>
                        )}
                        {activeTab !== 'financial' && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                onClick={() => setActiveTab(activeTab === 'basic' ? 'financial' : null)}
                            >
                                Next
                            </button>
                        )}
                        {activeTab === 'financial' && (
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Customer
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClientAdd