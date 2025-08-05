import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const AccountOpeningBalanceView = () => {
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5);
    const editOpeningAccount = useSelector((state) => state.AccountOpeningReducer.AccountOpeningReducer);

    const [tableData, setTableData] = useState([]);
    const [formData, setFormData] = useState({ DateStart: '', DateEnd: '' });

    const { id } = useParams();

    const getAccountName = (id) => {
        const acc = Account.find((a) => a._id === id);
        return acc ? `${acc.AccountCode} ${acc.AccountName}` : '';
    };

    const TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
    const TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);

    useEffect(() => {
        const opening = editOpeningAccount.find((item) => item._id == id);
        if (opening) {
            setFormData({
                DateStart: opening.DateStart,
                DateEnd: opening.DateEnd,
            });
            setTableData(opening.AccountsData);
        }
    }, [editOpeningAccount, id]);

    return (
        <div className="p-4">
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Account Opening (View)</h1>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year From</label>
                        <div className="border px-3 py-2 rounded-md bg-gray-100 text-sm">{formData.DateStart}</div>
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year To</label>
                        <div className="border px-3 py-2 rounded-md bg-gray-100 text-sm">{formData.DateEnd}</div>
                    </div>
                </div>

                <div className="overflow-x-auto mb-6">
                    <table className="w-full border-collapse text-sm md:text-base">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 min-w-[200px]">Account</th>
                                <th className="border p-2">Debit</th>
                                <th className="border p-2">Credit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="border p-2">{getAccountName(row.Account)}</td>
                                    <td className="border p-2">{row.Debit}</td>
                                    <td className="border p-2">{row.Credit}</td>
                                </tr>
                            ))}
                        </tbody>
                        {tableData.length !== 0 && (
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

export default AccountOpeningBalanceView;
