import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select'
import { getDataFundtion, updateDataFunction } from '../../../Api/CRUD Functions';
import { fetchAdminReducer } from '../../../Redux/Reducers/AdminReducer';
import { fetchClient } from '../../../Redux/Reducers/ClientReducer';
import { fetchChartofAccounts } from '../../../Redux/Reducers/ChartofAccountsReduser';


const NoqoffAmount = () => {
    const navigate = useNavigate();
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
    const CustomerAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    const Client = useSelector((state) => state.Client.client)

    const [voucherType, setVoucherType] = useState("")
    const [ClinetAccount, setClinetAccount] = useState("");
    const [tableData, setTableData] = useState([]);
    const [invDrp, setInvDrp] = useState([])
    const [RecDrp, setRecDrp] = useState([])
    const [ClientInv, setClientInv] = useState([])
    const [ClientRec, setClientRec] = useState([])
    const SoftStore = useSelector((state) => state.Store.Store)
    const store = [{
        _id: "0",
        StoreName: "Head Office",
        StoreCode: "HO"
    }].concat(SoftStore)

    const result = [];
    for (let i = CustomerAccountNumber.CustomerFrom; i <= CustomerAccountNumber.CustomerTo; i++) {
        result.push(i.toString().padStart(5, '0')); // Adjust to 5 digits
    }
    const Customer = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))

    const loadAccounts = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = filteredAccount
            .filter((item) =>
                item.AccountName.toLowerCase().includes(inputValue.toLowerCase()) || item.AccountCode.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50);

        return filtered.map((item) => ({
            label: `${item.AccountCode} ${item.AccountName}`,
            value: item._id,
            code: item.AccountCode
        }));
    }
    const CustomerAccount = Customer.map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id,
        code: item.AccountCode
    }));;

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
const dispatch = useDispatch()
const getData = async () =>{
    const adminId = "68903ec2664155e11db10367"
    const res = await getDataFundtion(`/Administrative/get/${adminId}`)
    const customer = await getDataFundtion("/customer")
    const ChartofAccounts = await getDataFundtion("/chartofAccounts")
        dispatch(fetchChartofAccounts(ChartofAccounts.data))
        dispatch(fetchAdminReducer(res.data))
        dispatch(fetchClient(customer.data))
        console.log(customer)
}

useEffect(()=>{
getData()
},[])

    const GetCUstomerData = async () => {
        const selectClient = Client.find((item) => item.AccountCode === ClinetAccount.code)
        const ClientInvoice = await getDataFundtion(`SaleInvoice/invoiceClient/${selectClient._id}`)
        const ClientRecipt = await getDataFundtion(`/voucher/getOnlyCredit/${ClinetAccount.value}`)
        const clinetINv = ClientInvoice.data.map((item) => ({
            value: item.SalesInvoice,
            label: item.SalesInvoice
        }))
        const clientRec = ClientRecipt.map((item) => ({
            value: item.VoucherNumber,
            label: item.VoucherNumber
        }))
        setClientInv(clinetINv)
        setClientRec(clientRec)
        setTableData([{
          ClinetAccount:  ClinetAccount.label
        }])
        setInvDrp(ClientInvoice.data)
        setRecDrp(ClientRecipt)
    }
    const handleCellChange = async (id, field, value) => {
        let newTableData = [...tableData];

        const rowIndex = newTableData.findIndex(row => row.id === id);
        if (rowIndex === -1) return;

        let updatedRow = { ...newTableData[rowIndex], [field]: value };
        const checking = tableData.find((item) => item.id == id);

        if (field == "Recipt") {
            updatedRow.Recipt === value.value
            updatedRow.VoucherAmount = RecDrp.find((item) => item.VoucherNumber == value.value).VoucharData.AdjustedAmount
            updatedRow.EntryId = RecDrp.find((item) => item.VoucherNumber == value.value).VoucharData.id

        }
        if (field == "Invoice") {
            updatedRow.Invoice === value.value
            updatedRow.invoiceAmount = invDrp.find((item) => item.SalesInvoice == value.value).RemainingAmount
        }

        if (field == "InvoiceAmount") {
            if(Number(value) > Number(updatedRow.VoucherAmount)) {
                return toast.error("Amount Should Be Less then Voucher Amount")
            }
            updatedRow.invoiceAmount = value
        }

        newTableData[rowIndex] = updatedRow;

        setTableData(newTableData);
    };






    const onSubmit = async (data) => {
      data.AdjustedData = tableData
      try{
        console.log(data)
        const res = await updateDataFunction("/voucher/AdjustVoucher" , data)
        console.log(res)
        toast.success("Invoive Adjust Successfully")
        navigate(0)
      }catch(err){
        toast.err("Some Thing Went Wrong")
      }
    }

   

    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Knockoff</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Client Account </label>
                        <Select
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) => setClinetAccount(selectedOption)}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            options={CustomerAccount}
                            value={ClinetAccount ? {
                                value: `${ClinetAccount}`,
                                label: `${ClinetAccount?.label}`
                            } : null}
                            className="basic-single text-sm"
                            classNamePrefix="select"
                            isSearchable
                            isClearable={true}
                            placeholder="Select Client account..."
                            isDisabled={tableData.length != 0 ? true : false}
                        />
                    </div>
                    <div>
                        <button
                            type='Button'
                            className='bg-blue-400 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300 mt-[5%]'
                            onClick={GetCUstomerData}
                        >
                            Get Data
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 w-[100px]">Account </th>
                                <th className="border p-2" style={{ width: "8vw" }}>Voucher</th>
                                <th className="border p-2" style={{ width: "5vw" }}>Voucher Amount</th>
                                <th className="border p-2" style={{ width: "5vw" }}>Invoice</th>
                                <th className="border p-2" style={{ width: "5vw" }}>Invoice Amount</th>

                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <>
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            {row.ClinetAccount}
                                        </td>
                                        <td className="border p-2">
                                            <Select menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} options={ClientRec}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'Recipt', selectedOption || '')
                                                }

                                            />
                                        </td>
                                        <td className="border p-2">
                                            {row.VoucherAmount}
                                        </td>
                                        <td className="border p-2">
                                            <Select menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} options={ClientInv}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'Invoice', selectedOption || '')
                                                }

                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input type="number"
                                                onChange={(e) =>
                                                    handleCellChange(row.id, 'InvoiceAmount', e.target.value|| '')
                                                }
                                                className="w-full p-1 text-xs md:text-sm border rounded"
                                                value={row.invoiceAmount} />
                                        </td>
                                    </tr>

                                    {/* Narration row */}

                                </>

                            ))}
                        </tbody>

                    </table>
                </div>
                <div className="flex flex-col md:flex-row gap-4 justify-between">

                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
                    >
                        Knockoff invoice
                    </button>
                </div>
            </form>
        </div>
    )
}

export default NoqoffAmount