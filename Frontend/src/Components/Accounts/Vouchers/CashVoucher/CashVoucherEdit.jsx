import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion, updateDataFunction } from '../../../../Api/CRUD Functions';
import { rangeBetween } from '../../../Global/GenrateCode';
import Select from 'react-select'


const CashVoucherEdit = () => {
    const navigate = useNavigate();
    const Client = useSelector((state) => state.Client.client)
    const [voucherType, setVoucherType] = useState("")
    const [debitAccount, setDebitAccount] = useState("");
    const [creditAccount, setCreditAccount] = useState("");
    const [invDrp, setInvDrp] = useState([])
    const [ClientInv, setClientInv] = useState([])
    const SoftStore = useSelector((state) => state.Store.Store)
    const { id } = useParams();
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
    const Vendor = useSelector((state) => state.Vendor.state)
    const EditVoucher = useSelector((state) => state.VoucherReducer.Voucher)
    const ChqBook = useSelector((state) => state.ChqBook.ChqBook)
    const [unUsedChq, setUnuseChq] = useState([])
    const [chq, setChq] = useState('')
    const CashAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    const store = [{
        _id: "0",
        StoreName: "Head Office",
        StoreCode: "HO"
    }].concat(useSelector((state) => state.Store.Store))

    const result = [];
    for (let i = CashAccountNumber.CashAccountFrom; i <= CashAccountNumber.CashAccountTo; i++) {
        result.push(i.toString().padStart(5, '0')); // Adjust to 5 digits
    }
    const AllVendorDrp = Account.filter((Acc) => Acc._id == CashAccountNumber.WithholdingTax).concat(Vendor)
    const AllVendor = AllVendorDrp.map((item) => ({
        label: `${item.VendorName || item.AccountName} `,
        value: item._id
    }));

    const ALLStore = store.map((item) => ({
        label: `${item.StoreName}`,
        value: item._id
    }));
    console.log(ALLStore)
    const Cash = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))
    const [MainAccount, setMainAccount] = useState("");
    const [tableData, setTableData] = useState([]);
    const [unUsedCHqData, setUsedCHqData] = useState([])
    const [PaidFor, setPaidFor] = useState("vendor");
    console.log(PaidFor)
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
    const CashAccount = Cash.map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id
    }));;
    const startingAccount = filteredAccount.slice(0, 50).map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id
    }));;
    const [show, setShow] = useState(false)
    const { reset, register, handleSubmit, formState: { errors } } = useForm();

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
                    else {
                        updatedRow.Account = CashAccountNumber.Vendor
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
            Account: voucherType === "CR" ? debitAccount : creditAccount,
            Credit: voucherType === "CP" ? Math.abs(TotalDebit - TotalCredit) : 0,
            Debit: voucherType === "CR" ? Math.abs(TotalDebit - TotalCredit) : 0,
            Narration: tableData[0].Narration,
            show: true

        })
        voucherType === "CR" ? data.DebitAccount = debitAccount : data.CreditAccount = creditAccount
        data.VoucharData = tableData,
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
        data.Status = "false"
        try {

            const res = await updateDataFunction(`/Voucher/update/${id}`, data)
            if (chq.label !== unUsedCHqData.label) {
                console.log("equal")
                await updateDataFunction(`/ChqBook/ChangeStatus/${data.ChequeBook}`, UsedChq)
                await updateDataFunction(`/ChqBook/ChangeStatus/${unUsedCHqData.value}`, unUsedChq)
            }
            toast.success("Cash Payment Voucher Updated Successfully")
            console.log(res)
            setTimeout(() => {
                navigate("/CashVoucher");
            }, 1000);
        } catch (err) {
            console.log(err)
            toast.error("some thing went wrong")
        }
    }

    const SetDrp = (val, ps) => {
        setMainAccount(val)
        setUnuseChq([])
        ps === undefined ? setChq('') : null
        const AllChq = ChqBook.filter((item) => item.Cash == val)
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

    const getData = () => {
        const voucherData = EditVoucher.find((item) => item._id == id);

        if (voucherData) {
            setMainAccount(voucherData.VoucherMainAccount);
            setTableData(voucherData.VoucharData)
            setVoucherType(voucherData.VoucherType);
            setDebitAccount(voucherData.DebitAccount)
            setCreditAccount(voucherData.CreditAccount)
            setChq({
                label: voucherData.ChequeNumber,
                value: voucherData.ChequeBook
            })
            setUsedCHqData({
                label: voucherData.ChequeNumber,
                value: voucherData.ChequeBook
            })
            SetDrp(voucherData.VoucherMainAccount, 1)
            reset({
                VoucherDate: voucherData.VoucherDate.split("T")[0],
                Voucher: voucherData.VoucherNumber,
                Cheque: voucherData.Cheque,
                Remarks: voucherData.Remarks,
            });

        }
    }

    useEffect(() => {
        getData();
    }, [id, EditVoucher]);
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
            backgroundColor: state.isSelected,
            color: '#000',
        }),
    };
    const VoucherType = [{
        value: "CP",
        label: "CP Cash Payment Voucher",
    },
    {
        value: "CR",
        label: "CR Cash Recipt Voucher",
    }
    ]
    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">{VoucherType.find((val) => val.value === voucherType)?.label}</h1>

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
                            isDisabled={true}
                            className="basic-single text-sm"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Voucher Type"
                        />
                    </div>
                    {
                        voucherType == "CP" ?
                            <div>
                                <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Credit Account </label>
                                <Select
                                    menuPortalTarget={document.body}
                                    onChange={(selectedOption) => setCreditAccount(selectedOption.value)}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    options={CashAccount}
                                    value={creditAccount ? {
                                        value: `${creditAccount}`,
                                        label: `${Account.find((c) => c._id == creditAccount)?.AccountCode} ${Account.find((c) => c._id === creditAccount)?.AccountName}`
                                    } : null}
                                    className="basic-single text-sm"
                                    classNamePrefix="select"
                                    isSearchable
                                    placeholder="Select credit account..."
                                />
                            </div>
                            : voucherType == "CR" ? <div>
                                <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Debit Account </label>
                                <Select
                                    menuPortalTarget={document.body}
                                    onChange={(selectedOption) => setDebitAccount(selectedOption.value)}
                                    styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                    options={CashAccount}
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
                        Edit Cash Payment Voucher
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CashVoucherEdit