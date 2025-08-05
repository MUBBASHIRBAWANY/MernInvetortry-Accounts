import React, { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction } from '../../../../Api/CRUD Functions';

const InvoiceOpeningEdit = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const Client = useSelector((state) => state.Client.client);
    const editOpeningInvoices = useSelector((state) => state.OpeningInvoices.OpeningInvoices);

    const [tableData, setTableData] = useState([]);

    const { reset, register, handleSubmit, formState: { errors } } = useForm();

    const clientMap = useMemo(() => {
        const map = {};
        Client.forEach(c => map[c._id] = c);
        return map;
    }, [Client]);

    const loadClients = useMemo(() =>
        debounce((inputValue, callback) => {
            if (!inputValue) return callback([]);
            const filtered = Client.filter(item =>
                item.CutomerName.toLowerCase().includes(inputValue.toLowerCase()) ||
                item.code.toLowerCase().includes(inputValue.toLowerCase())
            ).slice(0, 20);

            callback(filtered.map(item => ({
                label: `${item.mastercode} ${item.CutomerName}`,
                value: item._id
            })));
        }, 300)
    , [Client]);

    const startingClient = useMemo(() => Client.slice(0, 20).map(item => ({
        label: `${item.mastercode} ${item.CutomerName}`,
        value: item._id
    })), [Client]);

    const addNewRow = () => {
        setTableData(prev => [
            ...prev,
            { id: Date.now(), Client: '', Amount: '', Invoice: "" }
        ]);
    };

    const removeRow = (id) => {
        setTableData(prev => prev.filter(row => row.id !== id));
    };

    const handleCellChange = (id, field, value) => {
        setTableData(prev =>
            prev.map(row => {
                if (row.id !== id) return row;

                const updatedRow = { ...row };

                if (field === "Client") {
                    updatedRow.Client = value?.value || '';
                    updatedRow.Amount = '';
                    updatedRow.Invoice = '';
                } else {
                    updatedRow[field] = value;
                }

                return updatedRow;
            })
        );
    };

    useEffect(() => {
        if (!editOpeningInvoices?.length) return;
        const Data = editOpeningInvoices.find(item => item._id === id);
        if (Data) {
            reset({
                DateStart: Data.DateStart,
                DateEnd: Data.DateEnd
            });
            setTableData(Data.InvoiceData || []);
        }
    }, [editOpeningInvoices, id, reset]);

    const TotalDebit = useMemo(() =>
        tableData.reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0),
    [tableData]);

    const onSubmit = async (formData) => {
        formData.InvoiceData = tableData;
        try {
            const res = await createDataFunction("/OpeningInvoice", formData);
            toast.success("Data Updated");
            setTimeout(() => navigate("/OpeningInvoiceList"), 2000);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="p-4">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Invoice Opening</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year From</label>
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
                                <th className="border p-2 min-w-[200px]">Client</th>
                                <th className="border p-2">Invoice</th>
                                <th className="border p-2">Amount</th>
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
                                                handleCellChange(row.id, 'Client', selectedOption)
                                            }
                                            loadOptions={loadClients}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            defaultOptions={startingClient}
                                            value={row.Client ? {
                                                value: row.Client,
                                                label: `${clientMap[row.Client]?.mastercode} ${clientMap[row.Client]?.CutomerName}`
                                            } : null}
                                            className="basic-single text-sm"
                                            classNamePrefix="select"
                                            isSearchable
                                            placeholder="Select customer..."
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="text"
                                            value={row.Invoice}
                                            onChange={(e) => handleCellChange(row.id, 'Invoice', e.target.value)}
                                            className="w-full p-1 text-xs md:text-sm border rounded"
                                            style={{ height: "30px" }}
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            value={row.Amount}
                                            onChange={(e) => handleCellChange(row.id, 'Amount', e.target.value)}
                                            className="w-full p-1 text-xs md:text-sm border rounded"
                                            style={{ height: "30px" }}
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
                        {tableData.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2">Total</td>
                                    <td className="border p-2">{TotalDebit}</td>
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
                        Edit Opening Invoice
                    </button>
                </div>
            </form>
        </div>
    );
};

export default InvoiceOpeningEdit;
