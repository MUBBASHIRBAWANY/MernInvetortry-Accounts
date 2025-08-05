import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const InvoiceOpeningView = () => {
    const { id } = useParams();
    const Client = useSelector((state) => state.Client.client);
    const editOpeningInvoices = useSelector((state) => state.OpeningInvoices.OpeningInvoices);

    const [formData, setFormData] = useState({ DateStart: '', DateEnd: '' });
    const [tableData, setTableData] = useState([]);

    const clientMap = useMemo(() => {
        const map = {};
        Client.forEach(c => map[c._id] = c);
        return map;
    }, [Client]);

    useEffect(() => {
        if (!editOpeningInvoices?.length) return;
        const Data = editOpeningInvoices.find(item => item._id === id);
        if (Data) {
            setFormData({
                DateStart: Data.DateStart,
                DateEnd: Data.DateEnd,
            });
            setTableData(Data.InvoiceData || []);
        }
    }, [editOpeningInvoices, id]);

    const TotalDebit = useMemo(() =>
        tableData.reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0),
        [tableData]
    );

    return (
        <div className="p-4">
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Invoice Opening (View Only)</h1>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year From</label>
                        <p className="text-sm md:text-base">{formData.DateStart}</p>
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year To</label>
                        <p className="text-sm md:text-base">{formData.DateEnd}</p>
                    </div>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">Client</th>
                                <th className="border p-2">Invoice</th>
                                <th className="border p-2">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id || row._id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        {clientMap[row.Client]
                                            ? `${clientMap[row.Client].mastercode} ${clientMap[row.Client].CutomerName}`
                                            : 'N/A'}
                                    </td>
                                    <td className="border p-2">{row.Invoice}</td>
                                    <td className="border p-2">{parseFloat(row.Amount).toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                        {tableData.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2">Total</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2">{TotalDebit.toFixed(2)}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InvoiceOpeningView;
