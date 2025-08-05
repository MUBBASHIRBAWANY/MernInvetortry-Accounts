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
    const Vendor = useSelector((state) => state.Vendor.state)
    const BankAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    const ChqBook = useSelector((state) => state.ChqBook.ChqBook)

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


    const AllVendorDrp = Account.filter((Acc) => Acc._id == BankAccountNumber.WithholdingTax).concat(Vendor)
    const AllVendor = AllVendorDrp.map((item) => ({
        label: `${item.VendorName || item.AccountName} `,
        value: item._id
    }));

    const ALLStore = store.map((item) => ({
        label: `${item.StoreName}`,
        value: item._id
    }));

    const Bank = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))
    const [MainAccount, setMainAccount] = useState("");
    const [tableData, setTableData] = useState([]);
    const [PaidFor, setPaidFor] = useState("vendor");
    const [unUsedChq, setUnuseChq] = useState([])
    const [chq, setChq] = useState('')
    const [vendorStore, setVendorStore] = useState([])

    const loadAccounts = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = filteredAccount
            .filter((item) =>
                item.AccountName.toLowerCase().includes(inputValue.toLowerCase()) || item.AccountCode.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50);

        return filtered.map((item) => ({
            label: `${item.AccountCode} ${item.AccountName}`,
            value: item._id
        }));
    }
    const BankAccount = Bank.map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id
    }));;
    const startingAccount = filteredAccount.slice(0, 50).map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id
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

    const handleCellChange = (id, field, value) => {
        console.log(field)
        setTableData(tableData.map(row => {
            if (row.id === id) {

                const updatedRow = { ...row, [field]: value };
                const checking = tableData.find((item) => item.id == id)
                if (field == "vendor") {
                    const checkWth = Account.find((item) => item._id == value.value)
                    if (checkWth) {
                         updatedRow.Account = checkWth._id
                         updatedRow.vendor = ""
                         updatedRow.show = true
                    }
                    else{
                        updatedRow.Account = BankAccountNumber.Vendor
                        updatedRow.vendor = value.value
                         updatedRow.show = false

                    }
                    const someStore = Vendor.find((item) => item._id == value.value)?.Store;
                    if (someStore) {
                        const storeForVendor = SoftStore.filter((item) => someStore.includes(item._id))
                            .map((s) => ({
                                label: `${s.StoreName}`,
                                value: s._id
                            }))
                        setVendorStore(storeForVendor)
                    }
                    else {
                        const AllStore = SoftStore.map((item) => ({
                            label: `${item.StoreName}`,
                            value: item._id
                        }))
                        setVendorStore(AllStore)
                    }


                    if (checking.Account != value) {
                        updatedRow.Debit = 0
                        updatedRow.Credit = 0
                    }
                }

                if (updatedRow.Account == "") {
                    updatedRow.Debit = 0
                    updatedRow.Credit = 0
                }
                if (field == "store") {
                    updatedRow.store = value.value
                }

                if (field == "Account") {
                    console.log("first")
                    if (value.value === MainAccount) {
                        toast.error("You cannot select the main account as a transaction account");
                        updatedRow.Account = ""
                    }
                    else {
                        updatedRow.Account = value.value
                        updatedRow.Debit = 0
                        updatedRow.Credit = 0
                    }

                }
                if (field == "Debit") {
                    updatedRow.Debit = value
                    updatedRow.Credit = 0
                }
                if (field == "Credit") {
                    updatedRow.Credit = value
                    updatedRow.Debit = 0
                }
                if (field == "Ref") {
                    updatedRow.Ref = value
                }


                return updatedRow;
            }
            return row;
        }));
    };


    const TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
    const TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);

    const onSubmit = async (data) => {
        const value = TotalDebit - TotalCredit
        if (value <= 0) {
            return toast.error("Credit Account Not Be Zero")
        }
        tableData.push({
            id : Date.now(),
            Account: MainAccount,
            Credit: value,
            Narration: tableData[0].Narration,
            show: true

        })
        data.PaidFor = PaidFor
        data.VoucharData = tableData,
            data.VoucherMainAccount = MainAccount
        data.Status = "false"
        const code = await getDataFundtion('/Voucher/GetLastVouher/BP')
        console.log(code)
        if (code.length == 0) {
            data.VoucherNumber = "BP0000001"
        } else {
            let nextVoucherNumber = (parseInt(code[0].VoucherNumber.slice('2', "9"))) + 1
            data.VoucherNumber = `BP${nextVoucherNumber.toString().padStart(7, '0')}`;
        }
        data.VoucherType = "BP"
        data.TotalDebit = TotalDebit
        data.TotalCredit = TotalCredit
        data.ChequeNumber = chq.label
        data.ChequeBook = chq.value
        console.log(data)
        const UsedChq = {
            chqNumber: [chq.label],
            Status: "used",
        }
        setShow(true)
        try {
            console.log(data)
            const res = await createDataFunction("/Voucher", data)
            console.log(data.ChequeNumber)
            data.ChequeNumber !== "Online" ? updateDataFunction(`/ChqBook/ChangeStatus/${data.ChequeBook}`, UsedChq) : null

            toast.success("Bank Payment Voucher Updated Successfully")
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
    const SetDrp = (val) => {
        setMainAccount(val)
        setUnuseChq([])
        setChq('')
        const AllChq = ChqBook.filter((item) => item.Bank == val)
            .map((item1) => ({
                id: item1._id,
                chqs: item1.Cheuques[0]
            })).flat()
        const arr = []
        const combined = AllChq.flatMap((item, index) => {
            const id = item._id || item.id;
            Object.entries(item)
            arr.push({
                ref: item.id,
                chq: item.chqs

            })

        });
        let result = [];
        arr.forEach(obj => {
            obj.chq.forEach(innerObj => {
                result.push({
                    ref: obj.ref,
                    chq: innerObj.chq,
                    status: innerObj.status
                });
            });
        });
        const unUsedchq = result.filter((item) => item.status == "unUsed")
            .map((ch) => ({
                value: ch.ref,
                label: ch.chq
            }))
        const online = [{
            value: "Online",
            label: "Online"
        }].concat(unUsedchq)
        setUnuseChq(online)
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
    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Bank Paymnet Voucher</h1>

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
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Credit Account </label>
                        <Select
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) => SetDrp(selectedOption.value)}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            options={BankAccount}
                            value={MainAccount ? {
                                value: `${MainAccount}`,
                                label: `${Account.find((c) => c._id === MainAccount)?.AccountCode} ${Account.find((c) => c._id === MainAccount)?.AccountName}`
                            } : null}
                            className="basic-single text-sm"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Select credit account..."
                        />
                    </div>

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
                        <Select
                            menuPortalTarget={document.body}
                            onChange={(selectedOption) => setChq(selectedOption)}
                            options={unUsedChq}
                            value={chq ? {
                                value: `${chq.value}`,
                                label: `${chq.label}`
                            } : null}
                            styles={customStyles}
                            className="basic-single text-sm"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Select Chq..."
                        />
                    </div>
                    <div className='w-full col-span-1'>
                        <label className="block text-sm md:text-base col-span-3 text-gray-700 font-semibold mb-2">Paid To </label>
                        <input
                            type="text"
                            style={{ height: "38px", width: "100%" }}
                            {...register("PaidTo", { required: true })}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 col-span-5"
                        />
                    </div>



                    <div className='flex gap-2 col-span-1'>
                        <label className="text-sm md:text-base text-gray-700 font-semibold mb-2">
                            Paid to Vendor
                        </label>
                        <input
                            type="radio"
                            name="PaidFor"
                            value="vendor"
                            disabled={tableData.length !== 0 ? true : false}
                            onChange={(e) => setPaidFor(e.target.value)}
                            checked={PaidFor === "vendor"}
                            className="focus:ring-blue-500"
                        />

                        <label className="text-sm md:text-base text-gray-700 font-semibold mb-2">
                            Paid to Other
                        </label>
                        <input
                            type="radio"
                            name="PaidFor"
                            value="other"
                            disabled={tableData.length !== 0 ? true : false}
                            onChange={(e) => setPaidFor(e.target.value)}
                            checked={PaidFor === "other"}
                            className="focus:ring-blue-500"
                        />
                    </div>


                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">{PaidFor == "other" ? "Account" : "Vendor"}</th>
                                <th className="border p-2" style={{ width: "8vw" }} >Store</th>
                                <th className="border p-2" style={{ width: "8vw" }}>Ref</th>
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
                                            {PaidFor == "vendor" ? <Select
                                                menuPortalTarget={document.body}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'vendor', selectedOption || '')
                                                }
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                options={AllVendor}
                                                value={row.show == true ? (row.Account
                                                    ? {
                                                        value: row.Account,
                                                        label: `${Account.find((c) => c._id === row.Account)?.AccountCode} ${Account.find((c) => c._id === row.Account)?.AccountName}`,
                                                    }
                                                    : null) : (row.vendor ? {
                                                        value: `${row.vendor}`,
                                                        label: `${Vendor.find((c) => c._id === row.vendor)?.VendorName}`
                                                    } : null)}
                                                className="basic-single text-sm"
                                                classNamePrefix="select"
                                                isSearchable
                                                placeholder="Select Vendor..."
                                            /> : <AsyncSelect
                                                menuPortalTarget={document.body}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'Account', selectedOption || '')
                                                }
                                                loadOptions={loadAccounts}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                defaultOptions={startingAccount}
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
                                            }
                                        </td>
                                        <td>
                                            <Select
                                                menuPortalTarget={document.body}
                                                onChange={(selectedOption) =>
                                                    handleCellChange(row.id, 'store', selectedOption || '')
                                                }
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                options={PaidFor === "vendor" ? vendorStore : ALLStore}
                                                value={row.store ? {
                                                    value: `${row.store}`,
                                                    label: `${ALLStore.find((c) => c.value === row.store)?.label}`
                                                } : null}
                                                className="basic-single text-sm"
                                                classNamePrefix="select"
                                                isSearchable
                                                style={{ width: "5vw" }}
                                                placeholder="Select Vendor..."
                                            />
                                        </td>
                                        <td colSpan={1} className="p-2 border-t">
                                            <input
                                                type="text"
                                                value={row.Ref || ''}
                                                onChange={(e) => handleCellChange(row.id, 'Ref', e.target.value)}
                                                placeholder="Enter Ref..."
                                                className="w-full p-2 text-xs md:text-sm border rounded"
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