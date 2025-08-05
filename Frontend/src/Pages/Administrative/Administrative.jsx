import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux"
import Select from 'react-select'
import { getDataFundtion, createDataFunction, updateDataFunction } from "../../Api/CRUD Functions";
import { fetchChartofAccounts } from '../../Redux/Reducers/ChartofAccountsReduser';
import { fetchAdminReducer } from '../../Redux/Reducers/AdminReducer';

const Administrative = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },

    } = useForm();
    const id = "68903ec2664155e11db10367"
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [data, setData] = useState([])
    const [Fininshed, setFininshed] = useState('')
    const [customer, setCustomer] = useState('')
    const [vendors, setVendors] = useState('')
    const [gst, setGst] = useState('')
    const [purchaseDiscount, setPurchaseDiscount] = useState('')
    const [tradeDiscount, setTradeDiscount] = useState('')
    const [SaleDiscount, SetSaleDiscount] = useState('')
    const [AdvanceTax, setAdvanceTax] = useState('')
    const [salesRevenue, SetsalesRevenue] = useState('')
    const [WithholdingTax, setWithholdingTax] = useState('')
    const [COSTOFSALES, setCOSTOFSALES] = useState('')
    const [DAMAGEEXPIRECLAIM, setDAMAGEEXPIRECLAIM] = useState('')
    const [DitributerDiscount, setDitributerDiscount] = useState('')

    console.log(purchaseDiscount, tradeDiscount)
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const Channel = useSelector((state) => state.Channel.channel)
    const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
    const stage1Accounts = Accounts.filter((item) => item.AccountCode.length > 5)
        .map((Ac) => {
            return ({
                label: `${Ac.AccountName}  ${Ac.AccountCode}`,
                value: Ac._id
            })

        })

    const getData = async () => {
        const Accounts = await getDataFundtion("/ChartofAccounts")
        const list = Accounts.data
        const res = await getDataFundtion(`/Administrative/get/${id}`)
        const adminData = res.data
        setData(adminData)
        setFininshed(adminData.finishedGoods)
        setCustomer(adminData.Client)
        setVendors(adminData.Vendor)
        SetSaleDiscount(adminData.SaleDiscount)
        setAdvanceTax(adminData.AdvanceTax)
        SetsalesRevenue(adminData.salesRevenue)
        setPurchaseDiscount(adminData.PurchaseDiscount)
        setTradeDiscount(adminData.TradeDiscount)
        setCOSTOFSALES(adminData.COSTOFSALES)
        setDAMAGEEXPIRECLAIM(adminData.DAMAGEEXPIRECLAIM)
        setDitributerDiscount(adminData.DitributerDiscount)
        setWithholdingTax(adminData.WithholdingTax)
        setGst(adminData.Gst)
        console.log(gst)
        dispatch(fetchChartofAccounts(list))
        dispatch(fetchAdminReducer(adminData))
        reset({
            CashAccountFrom: adminData.CashAccountFrom,
            CashAccountTo: adminData.CashAccountTo,
            BankAccountFrom: adminData.BankAccountFrom,
            BankAccountTo: adminData.BankAccountTo,
            finishedGoods: adminData.finishedGoods,
            Client: adminData.Client,
            Vendor: adminData.Vendor,
            Gst: adminData.Gst,
            AdvanceTax: adminData.AdvanceTax,
            tradeDiscount: adminData.tradeDiscount,
            VendorFrom : adminData.VendorFrom,
            VendorTo : adminData.VendorTo,
            CustomerFrom : adminData.CustomerFrom,
            CustomerTo : adminData.CustomerTo
        })
    }
    useEffect(() => {
        getData()
    }, [])
    console.log(Channel)
    const [prChannel, setPrChannel] = useState("")
    const checkAcess = async () => {
        console.log(UserRihts)
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
            navigate("/")
        }
    }

    const onSubmit = async (data) => {
        data.finishedGoods = Fininshed;
        data.Client = customer;
        data.Vendor = vendors
        data.Gst = gst
        data.SaleDiscount = SaleDiscount;
        data.PurchaseDiscount = purchaseDiscount
        data.TradeDiscount = tradeDiscount
        data.salesRevenue = salesRevenue,
            data.AdvanceTax = AdvanceTax
        data.WithholdingTax = WithholdingTax
        data.COSTOFSALES = COSTOFSALES
        data.DAMAGEEXPIRECLAIM = DAMAGEEXPIRECLAIM
        data.DitributerDiscount = DitributerDiscount
        data.WithholdingTax = WithholdingTax
        console.log(data)
        try {
            const res = updateDataFunction(`/Administrative/update/${id}`, data)
            toast.success("Data Update Successfully")
        } catch (err) {
            console.log(err)
        }

    }

    const Channeldrp = Channel.map((item) => {
        return { value: item._id, label: `${item.ChanneName} (${item.code})` }
    })
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Administrative </h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Cash Account From </label>
                            <input
                                type="text"
                                {...register("CashAccountFrom")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Cash Account To</label>
                            <input
                                type="text"
                                {...register("CashAccountTo")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Bank Account From </label>
                            <input
                                type="text"
                                {...register("BankAccountFrom")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Bank Account To</label>
                            <input
                                type="text"
                                {...register("BankAccountTo")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Vendor From </label>
                            <input
                                type="text"
                                {...register("VendorFrom")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Vendor To</label>
                            <input
                                type="text"
                                {...register("VendorTo")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Customer From </label>
                            <input
                                type="text"
                                {...register("CustomerFrom")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Customer To</label>
                            <input
                                type="text"
                                {...register("CustomerTo")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Fininshed Goods</label>
                            <Select
                                options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === Fininshed)}
                                onChange={(e) => setFininshed(e.value)}
                            />

                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Gst </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === gst)}
                                onChange={(e) => setGst(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Advance Tax </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === AdvanceTax)}
                                onChange={(e) => setAdvanceTax(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sales Revenue </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === salesRevenue)}
                                onChange={(e) => SetsalesRevenue(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Discount </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === purchaseDiscount)}
                                onChange={(e) => setPurchaseDiscount(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Trade Discount </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === tradeDiscount)}
                                onChange={(e) => setTradeDiscount(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sale Discount </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === SaleDiscount)}
                                onChange={(e) => SetSaleDiscount(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Ditributer Discount </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === DitributerDiscount)}
                                onChange={(e) => setDitributerDiscount(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">With Holding Tax </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === WithholdingTax)}
                                onChange={(e) => setWithholdingTax(e.value)} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Cost of Good Sold </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === COSTOFSALES)}
                                onChange={(e) => setCOSTOFSALES(e.value)} />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">DAMAGE EXPIRE CLAIM </label>
                            <Select options={stage1Accounts}
                                value={stage1Accounts.find(item => item.value === DAMAGEEXPIRECLAIM)}
                                onChange={(e) => setDAMAGEEXPIRECLAIM(e.value)} />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-5 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Administrative