import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'
import { updateDataFunction } from '../../../Api/CRUD Functions'


const ClientUpdate = () => {
    const { id } = useParams()
    const allClient = useSelector((state) => state.Client.client)   
    const Vendor = useSelector((state) => state.Vendor.state)
    const Channel = useSelector((state) => state.Channel.channel)
    const SubChannel = useSelector((state) => state.subChannel.subChannel)
    const ChannelType = useSelector((state) => state.ChannelType.channelType)
    const [findCutomer, setfindCustomer] = useState(null)
    const [activeTab, setActiveTab] = useState('basic');
    const [SelectZone, setSelectZone] = useState('')
    const [SelectTerrotory, setSelectTerrotory] = useState('')
    const [selectCity, setSelectCity] = useState('')
    const [SelectRegion, setSelectRegion] = useState('')
    const Region = useSelector((state) => state.Region.Region)
    const Terrotory = useSelector((state) => state.Terrotory.Terrotory)
    const Zone = useSelector((state) => state.Zone.zone)
    const City = useSelector((state) => state.City.City)
    const [CityTerrotory, setCityTerrotory] = useState([])
    const [ZoneRegion, setZoneRegion] = useState([])
    const [RegionCity, setRegionCity] = useState([])

    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const navigate = useNavigate("/")
    const getData = async () => {
        const findClient = allClient.find((item) => item._id == id)
        setSelectZone(findClient.Zone)
        setSelectTerrotory(findClient.Terrotory)
        setSelectCity(findClient.City)
        setSelectRegion(findClient.Region)
        setfindCustomer(findClient)
        if (findClient) {
            reset({
                CutomerName: findClient.CutomerName,
                phone: findClient.phone,
                email: findClient.email,
                Address: findClient.Address,
                NTN: findClient.NTN,
                STN: findClient.STN,
                Fax: findClient.Fax,
                WebSite: findClient.WebSite,
                ContactPerson: findClient.ContactPerson,
                PurchaseDate: findClient.PurchaseDate,
                SalesFlowRef: findClient.SalesFlowRef,
                ShopOwner: findClient.ShopOwner,
                OwnerCnic: findClient.OwnerCnic,
                ShopRegisterDate: findClient.ShopRegisterDate,
                Filler: findClient.Filler,
                Registered: findClient.Registered,
                TTS: findClient.TTS,
                TradeActivity: findClient.TradeActivity,
                VDS: findClient.VDS,
                Tradeoffer: findClient.Tradeoffer,
                JBP: findClient.JBP,
                Status: findClient.Status,
                AdvanceTaxApply: findClient.AdvanceTaxApply,
                AcocuntCode1: findClient.AccountCode,
                mastercodeForCus1: findClient.mastercodeForCus
            })

        }
    }

    const AllZone = Zone.map((item) => {
        return ({
            value: item._id,
            label: `${item.ZoneName} ${item.code}`,
            code: item.code
        })
    })
    const AllRegion = ZoneRegion.map((item) => ({
        value: item._id,
        label: `${item.RegionName} ${item.code}`,
        code: item.code

    }));
    const CityDrp = RegionCity.map((item) => {
        return ({
            value: item._id,
            label: `${item.CityName} ${item.code}`,
            code: item.code
        })
    })
    const AllTerrotory = CityTerrotory.map((item) => ({
        value: item._id,
        label: `${item.TerrotoryName} ${item.code}`,
        code: item.code
    }));

    const onSubmit = async (data) => {
        try {
            const res = await updateDataFunction(`/customer/updatCustomer/${id}`, data)
            console.log(res)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/clientlist')
            }, 2000);
        } catch (err) {
            console.log(err)
            toast.error("Some Thing Went Wrong")
        }
    }
    const pageName = "CustomerEdit"
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const checkAcess = async () => {
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
            navigate("/")
        }
    }
    const VendorChnge = (id) => {
        setSelectVendor(id)
        setSelectZone('')
        setChannelType('')

        const AllZone = Zone.filter((item) => item.vendor == id).map((item) => ({
            value: item._id,
            label: `${item.ZoneName}`,
        }));
        const AllChanelType = ChannelType.filter((item) => item.vendor == id).map((item) => ({
            value: item._id,
            label: `${item.ChanneTypeName}`,
        }));
        setChannelTypeDrp(AllChanelType)
        setZoneDrp(AllZone);
    }

    const ZoneChange = (id) => {
        setSelectZone(id)
        setSelectRegion('')
        const AllRegion = Region.filter((item) => item.Zone == id).map((item) => ({
            value: item._id,
            label: `${item.RegionName}`,
        }));
        setRegionDrp(AllRegion);
    }

    const RegionChange = (id) => {
        setSelectRegion(id)
        setSelectArea('')
        const AllArea = Area.filter((item) => item.Region == id).map((item) => ({
            value: item._id,
            label: `${item.AreaName}`,
        }));
        console.log(AllArea)
        setAreaDrp(AllArea);
    }

    const ChanelTypeChnage = (id) => {
        console.log(id)
        setChannelType(id)
        setSelectChannel('')
        const AllChannel = Channel.filter((item) => item.ChanneType == id).map((item) => ({
            value: item._id,
            label: `${item.ChanneName}`,
        }));

        setChannelDrp(AllChannel);
    }
    const ChanelChnage = (id) => {
        setSelectChannel(id)
        const AllSubChenal = SubChannel.filter((item) => item.Channel == id).map((item) => ({
            value: item._id,
            label: `${item.SubChanneName}`,
        }));
        setSubChannelDrp(AllSubChenal)
    }
    const Allvendor = Vendor.map((item) => {
        return ({
            value: item._id,
            label: `${item.VendorName} ${item.code}`
        })
    })
    const ChenalTypeOp = [
        {
            label: "Whole Saller",
            value: 1
        },
        {
            label: "Retailer",
            value: 2
        },
    ]



    useEffect(() => {
        checkAcess()

        getData()
    }, [])

    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Edit Customer</h1>
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
                                <label className="block text-gray-700 font-semibold mb-2">Account </label>
                                <input
                                    type="text"
                                    {...register("AcocuntCode1", { required: true })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={true}
                                />
                                {errors.exampleRequired && <span>This field is required</span>}
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Customer Name</label>
                                <input
                                    type="text"
                                    {...register("CutomerName", { required: true })}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"

                                />
                                {errors.exampleRequired && <span>This field is required</span>}
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
                                <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref</label>
                                <input
                                    type="email"
                                    {...register("SalesFlowRef")}
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
                                <label className="block text-gray-700 font-semibold mb-2">Zone</label>
                                <Select value={({
                                    value: Zone.find((item) => item._id == SelectZone)._id,
                                    label: Zone.find((item) => item._id == SelectZone).ZoneName

                                })} isDisabled={true} />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Region</label>
                                <Select value={({
                                    value: Region.find((item) => item._id == SelectRegion)._id,
                                    label: Region.find((item) => item._id == SelectRegion).RegionName

                                })} isDisabled={true} />
                            </div>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">City</label>
                                <Select value={({
                                    value: City.find((item) => item._id == selectCity)._id,
                                    label: City.find((item) => item._id == selectCity).CityName

                                })} isDisabled={true} />
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

export default ClientUpdate