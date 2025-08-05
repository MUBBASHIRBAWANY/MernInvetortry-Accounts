import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const ClientOpeningBalanceView = () => {
    const Client = useSelector((state) => state.Client.client);
    const editOpeningClient = useSelector((state) => state.ClientOpeningReducer.ClientOpeningReducer);
    const { id } = useParams();

    const [tableData, setTableData] = useState([]);
    const [dateRange, setDateRange] = useState({ DateStart: '', DateEnd: '' });

    const getData = () => {
        try {
            const data = editOpeningClient.find((item) => item._id === id);
            setTableData(data.ClientData);
            setDateRange({
                DateStart: data.DateStart,
                DateEnd: data.DateEnd
            });
        } catch (err) {
            console.error('Data not found:', err);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    const TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
    const TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);

    return (
        <div className="p-4">
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                Client Opening View
            </h1>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year From</label>
                        <p className="border px-3 py-2 rounded bg-gray-100">
                            {dateRange.DateStart?.slice(0, 10)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year To</label>
                        <p className="border px-3 py-2 rounded bg-gray-100">
                            {dateRange.DateEnd?.slice(0, 10)}
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">Client</th>
                                <th className="border p-2">Debit</th>
                                <th className="border p-2">Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, idx) => {
                                const clientInfo = Client.find((c) => c._id === row.Client);
                                return (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            {clientInfo
                                                ? `${clientInfo.mastercode} ${clientInfo.CutomerName}`
                                                : 'N/A'}
                                        </td>
                                        <td className="border p-2">{row.Debit}</td>
                                        <td className="border p-2">{row.Credit}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        {tableData.length > 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2 text-right">Total:</td>
                                    <td className="border p-2">{TotalDebit}</td>
                                    <td className="border p-2">{TotalCredit}</td>
                                </tr>
                            </tfoot>
                        )}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClientOpeningBalanceView;
