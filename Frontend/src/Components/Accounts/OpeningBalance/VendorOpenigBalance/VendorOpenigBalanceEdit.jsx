import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, updateDataFunction } from '../../../../Api/CRUD Functions';
import Select from 'react-select';



const VendorOpeningBalanceEdit = () => {
    const navigate = useNavigate();
    const Store = useSelector((state) => state.Store.Store)
    const Vendor = useSelector((state) => state.Vendor.state)
    const [selectedStore, setSelectedStore] = useState([]);
    const { id } = useParams();
    const editOpeningVendor = useSelector((state) => state.VendorOpeningReducer.VendorOpeningReducer)
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const getData = () => {
        try {
            const data = editOpeningVendor.find((item) => item._id == id)
            setTableData(data.VendorData)
            reset({
                DateStart: data.DateStart,
                DateEnd: data.DateEnd
            })
        } catch (err) {

        }
    }
    useEffect(() => {
        getData()
    }, [])




    const [tableData, setTableData] = useState([]);




    const loadVendors = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = Vendor
            .filter((item) =>
                item.VendorName.toLowerCase().includes(inputValue.toLowerCase()) || item.code.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50);

        return filtered.map((item) => ({
            label: `${item.VendorName}`,
            value: item._id
        }));
    }
    const startingVendor = Vendor.slice(0, 50).map((item) => ({
        label: `${item.VendorName}`,
        value: item._id
    }));;



    const addNewRow = () => {
        setTableData([...tableData, {
            id: Date.now(),
            Vendor: '',
            Debit: 0,
            Credit: 0,
        }]);
    };
    const getStoredState = (value) => {
        console.log(value)
        const findStore = Vendor.find((item) => item._id == value).Store
        const AllStore = Store.filter((item) => findStore.includes(item._id))
        return AllStore.map((item) => ({
            value: item._id,
            label: item.StoreName
        }))
    }

    const removeRow = (id) => {
        setTableData(tableData.filter(row => row.id !== id));
    };

    const handleCellChange = (id, field, value) => {

        setTableData(tableData.map(row => {
            if (row.id === id) {

                const updatedRow = { ...row, [field]: value };
                const checking = tableData.find((item) => item.id == id)
                if (field == "Vendor") {
                    updatedRow.Vendor = value.value
                    const findStore = Vendor.find((item) => item._id == value.value).Store
                    const AllStore = Store.filter((item) => findStore.includes(item._id))
                    setSelectedStore(AllStore.map((item) => ({ value: item._id, label: item.StoreName })))

                    if (checking.Vendor != value) {
                        updatedRow.Debit = 0
                        updatedRow.Credit = 0
                        updatedRow.Store = ""
                    }
                }
                if (updatedRow.Vendor == "") {
                    updatedRow.Debit = 0
                    updatedRow.Credit = 0
                    updatedRow.Store = ""
                }


                if (field == "Vendor") {
                    updatedRow.Debit = 0
                    updatedRow.Credit = 0
                    updatedRow.Store = ""
                }
                if (field == "Debit") {
                    updatedRow.Debit = value
                    updatedRow.Credit = 0
                }
                if (field == "Credit") {
                    updatedRow.Credit = value
                    updatedRow.Debit = 0
                }
                if (field == "Store") {
                    updatedRow.Store = value

                }

                return updatedRow;
            }
            return row;
        }));
    };
    const TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
    const TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);


    const onSubmit = async (data) => {
        data.VendorData = tableData
        data.Status = "false"
        console.log(data)
        try {
            const res = await updateDataFunction(`/VendorOpening/updateVendorOpening/${id}`, data)
            console.log(res)
            toast.success("Data Add")
            setTimeout(() => {
                navigate("/VendorOpenigBalanceList")
            }, 2000)

        } catch (err) {
            console.log(err)
            toast.error("some thing went wrong")
        }




    }

    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Vendor Opening</h1>

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
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year To</label>
                        <input
                            type="date"
                            {...register("DateEnd", { required: true })}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">Vendor</th>
                                <th className="border p-2">Store</th>
                                <th className="border p-2">Debit</th>
                                <th className="border p-2">Credit</th>
                                <th className="border p-2">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <AsyncSelect
                                            menuPortalTarget={document.body}
                                            onChange={(selectedOption) =>
                                                handleCellChange(row.id, 'Vendor', selectedOption || '')
                                            }
                                            loadOptions={loadVendors}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            defaultOptions={startingVendor}
                                            value={row.Vendor ? {
                                                value: `${row.Vendor} ${console.log(row)}`,
                                                label: ` ${Vendor.find((c) => c._id === row.Vendor)?.VendorName}`
                                            } : null}
                                            className="basic-single text-sm"
                                            classNamePrefix="select"
                                            isSearchable
                                            placeholder="Select customer..."
                                        />
                                    </td>
                                    <div>
                                        <Select
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            onChange={(e) => handleCellChange(row.id, 'Store', e.value)}
                                            className='basic-single text-sm mt-2'
                                            value={
                                                row.Store
                                                    ? {
                                                        value: row.Store,
                                                        label: Store.find((c) => c._id === row.Store)?.StoreName || ''
                                                    }
                                                    : null
                                            }
                                            options={selectedStore.length == 0 ? getStoredState(row.Vendor) : selectedStore}
                                        />
                                    </div>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            value={row.Debit}
                                            onChange={(e) => handleCellChange(row.id, 'Debit', e.target.value)}
                                            className="w-full p-1 text-xs md:text-sm border rounded"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            value={row.Credit}
                                            onChange={(e) => handleCellChange(row.id, 'Credit', e.target.value)}
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
                                    <td className="border p-2"></td>
                                    <td className="border p-2 hidden md:table-cell">{TotalDebit}</td>
                                    <td className="border p-2 hidden md:table-cell">{TotalCredit}</td>
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
                        Update Opening Balance
                    </button>
                </div>
            </form>
        </div>
    )
}

export default VendorOpeningBalanceEdit