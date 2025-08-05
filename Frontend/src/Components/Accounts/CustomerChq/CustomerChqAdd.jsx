import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import AsyncSelect from 'react-select/async';

import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const CustomerChqAdd = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [customer, setCustomer] = useState([])
    const navigate = useNavigate()
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    const Client = useSelector((state) => state.Client.client)
    const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
    const Invoice = useSelector((state) => state.SalesInvoice.SalesInvoice)
    const [tableData, setTableData] = useState([])



    const onSubmit = async (data) => {
        data.Customer = Customer
        console.log(data)
        try {
            if (data.CheuquesEnd <= data.CheuquesStart) {
                return toast.error("Cheuques To must be greaterthen Cheuques From")
            }
            else {
                await createDataFunction("/ChqBook", data)
                toast.success("ChqBook Added Successfully")
                setTimeout(() => {
                    navigate('/ChqBookList')
                }, 2000);
            }


        } catch (err) {
            console.log(err)
            toast.error("Failed to add ChqBook")
        }
    }
    const addNewRow = () => {
        setTableData([...tableData, {
            id: Date.now(),
            product: '',
            OpeningQty: 0,
        }]);
    };
    const removeRow = (id) => {
        setTableData(tableData.filter(row => row.id !== id));
    };


    const handleCellChange = (id, field, value) => {

        setTableData(tableData.map(row => {
            if (row.id === id) {

                const updatedRow = { ...row, [field]: value };
                const checking = tableData.find((item) => item.id == id)
                if (field == "Invoice") {
                    if (checking.Invoice != value) {
                        updatedRow.Amount = 0
                        updatedRow.RealizeDate = ""
                    }
                }
                if (updatedRow.Invoice == "") {
                    updatedRow.Amount = 0
                    updatedRow.RealizeDate = ""
                }

                return updatedRow;
            }
            return row;
        }));
    };

    const vendorIdSet = new Set(loginVendor.Vendor);

    const AllClient = Client.filter(customer =>
        customer.Vendor.some(vendorId => vendorIdSet.has(vendorId))
    );
    const loadclients = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = AllClient
            .filter((item) =>
                item.CutomerName.toLowerCase().includes(inputValue.toLowerCase()) || item.code.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50);

        return filtered.map((item) => ({
            label: `${item.CutomerName} ${item.code}`,
            value: item._id
        }));
    }

    const startingClient = AllClient.slice(0, 50).map((item) => ({
        label: `${item.CutomerName} ${item.code}`,
        value: item._id
    }));;
    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Opening Inventory </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year From </label>
                        <input
                            type="date"
                            {...register("DateStart", { required: true })}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Code</label>
                        <input
                            type="text"
                            {...register("Code1")}
                            disabled={true}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">Product</th>
                                <th className="border p-2">Opening Qty</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{
                                                menuPortal: base => ({ ...base, zIndex: 9999 }),
                                                control: (provided) => ({
                                                    ...provided,
                                                    minHeight: '35px',
                                                    fontSize: '14px'
                                                })
                                            }}
                                            value={row.product ? {
                                                value: row.product,
                                                label: `${Products.find((p) => p._id === row.product)?.mastercode} ${Products.find((p) => p._id === row.product)?.ProductName}`
                                            } : null}
                                            onChange={(selectedOption) =>
                                                handleCellChange(row.id, 'product', selectedOption?.value || '')
                                            }
                                            options={AllProduct.options}
                                            className="text-sm"
                                            classNamePrefix="select"
                                            placeholder="Select Product..."
                                            isSearchable
                                            isClearable
                                        />
                                    </td>

                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            value={row.opneingQty}
                                            onChange={(e) => handleCellChange(row.id, 'opneingQty', e.target.value)}
                                            className="w-full p-1 text-xs md:text-sm border rounded"
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
                            ))}
                        </tbody>
                        {tableData.length !== 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2"></td>
                                    <td className="border p-2 hidden md:table-cell">{totalOpneingQty}</td>
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
                        Create Opening Balance
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CustomerChqAdd