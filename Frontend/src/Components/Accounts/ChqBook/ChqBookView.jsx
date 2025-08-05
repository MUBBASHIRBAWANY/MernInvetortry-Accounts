import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { updateDataFunction } from '../../../Api/CRUD Functions';
import { toast, ToastContainer } from 'react-toastify';

const ChqBookView = () => {
    const [data, setData] = useState({});
    const [bankLabel, setBankLabel] = useState("");
    const [destroy, setDestroy] = useState([])
    console.log(destroy)
    const { id } = useParams();
    const BankAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer);
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
    const ChqBook = useSelector((state) => state.ChqBook.ChqBook);
    const navigate = useNavigate()
    const createChq = () => {
        const result = [];
        for (let i = data.CheuquesStart; i <= data.CheuquesEnd; i++) {
            result.push({
                chq: data.Prefix + i.toString(),
                status: "unUsed"
            });
        }
        console.log(result)
        try {
            const res = updateDataFunction(`/ChqBook/createChq/${id}`, {
                Cheuques: result,
                Status: "Chq Book Create"
            })
            toast.success("ChqBook Created Successfully")
            setTimeout(() => {
                navigate('/ChqBookList')
            }, 2000);
        } catch (err) {
            toast.error("Some Thing went wrong")
        }

    }
    const DestroyChq = async () => {
        const DestoryData = {
            chqNumber: destroy,
            Status: "destroy"

        }
        try {

            const res = await updateDataFunction(`/ChqBook/ChangeStatus/${id}`, DestoryData)
            toast.success("Chq Destroy")
            setTimeout(() => {
                navigate('/ChqBookList')
            }, 2000);
        } catch (err) {
            toast.error("Chq Some thing went wrong")
        }

    }

    useEffect(() => {
        const result = [];
        for (let i = BankAccountNumber.BankAccountFrom; i <= BankAccountNumber.BankAccountTo; i++) {
            result.push(i.toString().padStart(5, '0'));
        }

        const filteredAccount = Account.filter((item) => item.AccountCode.length > 5);
        const AllBank = filteredAccount.filter((item) =>
            result.some(prefix => item.AccountCode.startsWith(prefix))
        );

        const item = ChqBook.find((item) => item._id === id);
        if (item) {
            setData(item);
            const bankInfo = Account.find(acc => acc._id === item.Bank);
            setBankLabel(bankInfo ? `${bankInfo.AccountCode} ${bankInfo.AccountName}` : '');
        }
    }, [id, Account, BankAccountNumber, ChqBook]);

    //const avalibale data.Cheuques[0].filter((item)=> item.status == "unUsed")
    return (
        <div>
            <ToastContainer />
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">View ChqBook</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6">
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Bank</label>
                    <p className="px-4 py-2 border rounded-lg bg-gray-100">{bankLabel}</p>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Prefix</label>
                    <p className="px-4 py-2 border rounded-lg bg-gray-100">{data.Prefix}</p>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Chq No From</label>
                    <p className="px-4 py-2 border rounded-lg bg-gray-100">{data.CheuquesStart}</p>
                </div>
                <div>
                    <label className="block text-gray-700 font-semibold mb-2">Chq No To</label>
                    <p className="px-4 py-2 border rounded-lg bg-gray-100">{data.CheuquesEnd}</p>
                </div>
                <div>
                    <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={createChq}>
                        Add
                    </button>
                </div>
            </div>

            {/* Cheques Table */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Cheque List</h2>
                {data.Cheuques && data.Cheuques.length > 0 ? (
                    <table className="min-w-full border border-gray-300 text-sm">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border px-4 py-2 text-left">Cheque No</th>
                                <th className="border px-4 py-2 text-left">Status</th>
                                <th className="border px-4 py-2 text-left">Is Destroy</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.Cheuques.flat().map((item, index) =>
                                item.status == "unUsed" ? (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="border px-4 py-2">{item.chq}</td>
                                        <td className="border px-4 py-2 capitalize">{item.status}</td>
                                        <td className="border px-4 py-2 capitalize">
                                            <input
                                                type="checkbox"
                                                checked={destroy.includes(item.chq)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setDestroy(prev => [...prev, item.chq]);
                                                    } else {
                                                        setDestroy(prev => prev.filter(chq => chq !== item.chq));
                                                    }
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ) : null
                            )}
                        </tbody>

                    </table>
                ) : (
                    <p className="text-gray-500">No cheques available.</p>
                )}
                <div>
                    <div className="flex justify-end">
                        <button onClick={DestroyChq} className="text-white  mt-3 bg-red-500 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-md px-6 py-2 dark:bg-red-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                            Destroy Selected Chq
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ChqBookView;
