import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion, updateDataFunction } from '../../../../Api/CRUD Functions';
import { rangeBetween } from '../../../Global/GenrateCode';
import Select from 'react-select'


const BankPaymentVoucherAdd = () => {
    const navigate = useNavigate();
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
    const BankAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    const Client = useSelector((state) => state.Client.client)
    const [voucherType, setVoucherType] = useState("")
    const [debitAccount, setDebitAccount] = useState("");
    const [creditAccount, setCreditAccount] = useState("");
    const [tableData, setTableData] = useState([]);
    const [invDrp, setInvDrp] = useState([])
    const [ClientInv, setClientInv] = useState([])
    const SoftStore = useSelector((state) => state.Store.Store)
    const store = [{
        _id: "0",
        StoreName: "Head Office",
        StoreCode: "HO"
    }].concat(SoftStore)

    const result = [];
    for (let i = BankAccountNumber.BankAccountFrom; i <= BankAccountNumber.BankAccountTo; i++) {
        result.push(i.toString().padStart(5, '0')); // Adjust to 5 digits
    }



    const ALLStore = store.map((item) => ({
        label: `${item.StoreName}`,
        value: item._id
    }));

    const Bank = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))


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
    const BankAccount = Bank.map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id
    }));;
    const startingAccount = filteredAccount.slice(0, 50).map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id,
        code: item.AccountCode
    }));;
    const [show, setShow] = useState(false)
    const { register, handleSubmit, reset, formState: { errors } } = useForm();


    const addNewRow = () => {
        setTableData([...tableData, {
            id: Date.now(),
            Account: '',
            store: '',
            vendor: '',
            Debit: 0,
            Credit: 0,
        }]);
    };

    const removeRow = (id) => {
        setTableData(tableData.filter(row => row.id !== id));
    };

    const handleCellChange = async (id, field, value) => {
        let newTableData = [...tableData];

        const rowIndex = newTableData.findIndex(row => row.id === id);
        if (rowIndex === -1) return;

        let updatedRow = { ...newTableData[rowIndex], [field]: value };
        const checking = tableData.find((item) => item.id == id);



        // Reset debit/credit if no account
        if (updatedRow.Account === "") {
            updatedRow.Debit = 0;
            updatedRow.Credit = 0;
            setInvDrp([])
            updatedRow.ClientRef2 = ""
        }

        // Handle store field
        if (field === "store") {
            updatedRow.store = value.value;
        }

        // Handle Account field
        if (field === "Account") {
            updatedRow.Account = value.value
            setInvDrp([])
            const clientAccount = Client.find((item) => item.AccountCode === value.code)?._id
            if (clientAccount) {
                try {
                    const ClientInvoice = await getDataFundtion(`SaleInvoice/invoiceClient/${clientAccount}`)

                    setClientInv(ClientInvoice.data)
                    const DrpCutInv = ClientInvoice.data.map((item) => ({
                        label: item.SalesInvoice,
                        value: item.SalesInvoice,
                    }))
                    console.log(DrpCutInv)
                    setInvDrp(DrpCutInv)
                    updatedRow.ClientLine = "true"
                } catch (err) {

                }

            }
            if (value.value === debitAccount || value.value === creditAccount) {
                toast.error("You cannot select the main account as a transaction account");
                updatedRow.Account = "";
            } else {
                updatedRow.Account = value.value;
                updatedRow.Debit = 0;
                updatedRow.Credit = 0;
            }
        }

        // Handle Debit field
        if (field === "Debit") {
            updatedRow.Debit = value;
            updatedRow.Credit = 0;
        }

        // Handle Credit field
        if (field === "Credit") {
            updatedRow.Credit = value;
            updatedRow.Debit = 0;
        }

        // Handle Ref field (async part)
        if (field === "ClientRef2") {
            console.log(value)
            updatedRow.ClientRef2 = value.value;
            const RemainInvAmt = ClientInv.find((val) => val.SalesInvoice === value.value)?.RemainingAmount
            updatedRow.Credit = RemainInvAmt
        }

        // Update row in the new table data
        newTableData[rowIndex] = updatedRow;

        // Finally, update state
        setTableData(newTableData);
    };




    let TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
    let TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);
    const onSubmit = async (data) => {
        const value2 = TotalDebit - TotalCredit
        console.log(value2)
        if (value2 == 0) {
            return toast.error("Credit and Debit Account Not Be Zero")
        }
        const findAccount = tableData.find((ac) => ac.Account == debitAccount)
        if (findAccount) {
            return toast.error("Main Account not Allow to select in table")
        }
        tableData.push({
            id: Date.now(),
            Account: voucherType === "BR" ? debitAccount : creditAccount,
            Credit: voucherType === "BP" ? Math.abs(TotalDebit - TotalCredit) : 0,
            Debit: voucherType === "BR" ? Math.abs(TotalDebit - TotalCredit) : 0,
            Narration: tableData[0].Narration,
            show: true

        })

        data.VoucharData = tableData,
        voucherType === "BR" ? data.DebitAccount = debitAccount : data.CreditAccount = creditAccount
        data.status = "Post"
        const code = await getDataFundtion(`/Voucher/GetLastVouher/${voucherType}`)
        console.log(code)
        if (code.length == 0) {
            data.VoucherNumber = `${voucherType}0000001`
        } else {
            let nextVoucherNumber = (parseInt(code[0].VoucherNumber.slice('2', "9"))) + 1
            data.VoucherNumber = `BP${nextVoucherNumber.toString().padStart(7, '0')}`;
        }
        TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
        TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);
        data.VoucherType = voucherType
        data.TotalDebit = TotalDebit
        data.TotalCredit = TotalCredit
        const value = TotalDebit - TotalCredit
        console.log(value)
        if (value !== 0) {
            return toast.error("Credit Account Not Be Zero")
        }
        const invoiceData = tableData.filter((item)=> item.ClientLine == "true" )
        .map((inv)=>({
            amount : inv.Credit,
            inv :  inv.ClientRef2
        }))
        data.invoiceData = invoiceData
        try {
            
            console.log(data)
            const res = await createDataFunction("/Voucher", data)

            console.log(res)
            setTimeout(() => {
                navigate("/BankPaymentVoucherList");
            }, 1000);
        } catch (err) {
            if (err.status === 401) {
                console.log(err.response.data.message)
                toast.error(err.response.data.message)

            } else {
                console.log(err)
                toast.error("some thing went wrong")
            }
        }
    }

    useEffect(() => {
        const today = new Date();
        const formatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
        reset({
            VoucherDate: formatted
        })
    }, []);

    const customStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'transparent', // Entire input background
            borderColor: '#ccc',
        }),
        singleValue: (provided) => ({
            ...provided,
            backgroundColor: 'transparent', // Selected item in input
            color: '#000', // Text color
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
                ? 'transparent' // No background on selected option
                : state.isFocused
                    ? 'rgba(0, 0, 0, 0.05)' // Slight highlight on hover
                    : 'transparent',
            color: '#000',
        }),
    };


    const VoucherType = [{
        value: "BP",
        label: "BP Bank Payment Voucher",
    },
    {
        value: "BR",
        label: "BR Bank Recipt Voucher",
    }
    ]
    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Bank Book</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Voucher Date </label>
                        <input
                            type="date"
                            style={{ height: "38px" }}
                            {...register("VoucherDate", { required: true })}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Voucher Type </label>
                        <Select
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) => setVoucherType(selectedOption.value)}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            options={VoucherType}
                            value={voucherType ? VoucherType.find((val) => val.value === voucherType) : null}
                            isDisabled={tableData.length === 0 ? false : true}
                            className="basic-single text-sm"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Voucher Type"
                        />
                    </div>
                    {
                        voucherType == "BP" ?
                            <div>
                                <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Credit Account </label>
                                <Select
                                    menuPortalTarget={document.body}
                                    onChange={(selectedOption) => setCreditAccount(selectedOption.value)}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    options={BankAccount}
                                    value={creditAccount ? {
                                        value: `${creditAccount}`,
                                        label: `${Account.find((c) => c._id === creditAccount)?.AccountCode} ${Account.find((c) => c._id === creditAccount)?.AccountName}`
                                    } : null}
                                    className="basic-single text-sm"
                                    classNamePrefix="select"
                                    isSearchable
                                    placeholder="Select credit account..."
                                />
                            </div>
                            : voucherType == "BR" ? <div>
                                <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Debit Account </label>
                                <Select
                                    menuPortalTarget={document.body}
                                    onChange={(selectedOption) => setDebitAccount(selectedOption.value)}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    options={BankAccount}
                                    value={debitAccount ? {
                                        value: `${debitAccount}`,
                                        label: `${Account.find((c) => c._id === debitAccount)?.AccountCode} ${Account.find((c) => c._id === debitAccount)?.AccountName}`
                                    } : null}
                                    className="basic-single text-sm"
                                    classNamePrefix="select"
                                    isSearchable
                                    placeholder="Select Debit account..."
                                />
                            </div>
                                : null
                    }
                    {voucherType !== "" ?
                        <>
                            <div>
                                <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Voucher Number </label>
                                <input
                                    type="text"
                                    disabled={true}
                                    style={{ height: "38px" }}
                                    {...register("Voucher")}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Chq </label>
                                <input
                                    type="text"
                                    style={{ height: "38px" }}
                                    {...register("Cheque")}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className='w-full col-span-1'>
                                <label className="block text-sm md:text-base col-span-3 text-gray-700 font-semibold mb-2"> Remarks </label>
                                <input
                                    type="text"
                                    style={{ height: "38px", width: "100%" }}
                                    {...register("Remarks")}
                                    className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-5"
                                />
                            </div>
                        </> : null
                    }





                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">Account</th>
                                <th className="border p-2" style={{ width: "8vw" }}>Ref</th>
                                <th className="border p-2" style={{ width: "5vw" }}>Slip</th>
                                <th className="border p-2" style={{ width: "5vw" }}>Debit</th>
                                <th className="border p-2" style={{ width: "5vw" }}>Credit</th>
                                <th className="border p-2">Narration</th>
                                <th className="border p-2" style={{ width: "8vw" }}>Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <>
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            <AsyncSelect
                                                menuPortalTarget={document.body}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'Account', selectedOption || '')
                                                }
                                                loadOptions={loadAccounts}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                defaultOptions={startingAccount}
                                                isClearable={true}
                                                value={
                                                    row.Account
                                                        ? {
                                                            value: row.Account,
                                                            label: `${Account.find((c) => c._id === row.Account)?.AccountCode} ${Account.find((c) => c._id === row.Account)?.AccountName}`,
                                                        }
                                                        : null
                                                }
                                                className="basic-single text-sm"
                                                classNamePrefix="select"
                                                isSearchable
                                                placeholder="Select Account..."
                                            />
                                        </td>

                                        <td colSpan={1} className="p-2 border-t">
                                            <Select menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} options={invDrp}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'ClientRef2', selectedOption || '')
                                                }
                                                value={({
                                                    value: row.ClientRef2,
                                                    label: row.ClientRef2
                                                })}
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                style={{ width: "5vw" }}
                                                type="text"
                                                value={row.Slip}
                                                onChange={(e) => handleCellChange(row.id, 'Slip', e.target.value)}
                                                className="w-full p-1 text-xs md:text-sm border rounded"
                                            />
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                style={{ width: "5vw" }}
                                                type="number"
                                                value={row.Debit}
                                                onChange={(e) => handleCellChange(row.id, 'Debit', e.target.value)}
                                                className="w-full p-1 text-xs md:text-sm border rounded"
                                            />
                                        </td>

                                        <td className="border p-2">
                                            <input
                                                type="number"
                                                style={{ width: "5vw" }}
                                                value={row.Credit}
                                                onChange={(e) => handleCellChange(row.id, 'Credit', e.target.value)}
                                                className="w-full p-1 text-xs md:text-sm border rounded"
                                            />
                                        </td>
                                        <td colSpan={1} className="p-2 border-t">
                                            <input
                                                type="text"
                                                value={row.Narration || ''}
                                                onChange={(e) => handleCellChange(row.id, 'Narration', e.target.value)}
                                                placeholder="Enter narration..."
                                                className="w-full p-2 text-xs md:text-sm border rounded"
                                            />
                                        </td>

                                        <td className="border p-2">
                                            <button
                                                type="button"
                                                onClick={() => removeRow(row.id)}
                                                className="bg-red-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-red-600"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>

                                    {/* Narration row */}

                                </>

                            ))}
                        </tbody>
                        {tableData.length !== 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2 hidden md:table-cell">{TotalDebit}</td>
                                    <td className="border p-2 hidden md:table-cell">{TotalCredit}</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>

                                </tr>
                            </tfoot>

                        )}
                    </table>
                </div>

                <div className="flex flex-col md:flex-row gap-4 justify-between">
                    <button
                        type="button"
                        onClick={addNewRow}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm md:text-base"
                    >
                        Add Row
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
                    >
                        Create Bank Payment Voucher
                    </button>
                </div>
            </form>
        </div>
    )
}

export default BankPaymentVoucherAdd