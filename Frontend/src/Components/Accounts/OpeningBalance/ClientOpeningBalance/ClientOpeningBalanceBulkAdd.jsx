import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import { ConvetDate } from '../../../Global/getDate';
import { XmlFactory } from '@ag-grid-community/all-modules';
import { createDataFunction } from '../../../../Api/CRUD Functions';


const ClientOpeningBalanceBulkAdd = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const Vendor = useSelector((state) => state.Vendor.state)
    const Products = useSelector((state) => state.Product.product);
    const Location = useSelector((state) => state.Location.Location);
    const Store = useSelector((state) => state.Store.Store)
    console.log(Vendor)
    const navigate = useNavigate()
    const [hide, setHide] = useState(false)
    const Client = useSelector((state) => state.Client.client)

    ConvetDate

    const onSubmit = async () => {
        const CHUNK_SIZE = 100;

        const mergedData = data.reduce((acc, entry) => {
            const key = "data";
            if (!acc[key]) {
                acc[key] = {
                    DateStart: ConvetDate(entry.StartDate),
                    DateEnd: ConvetDate(entry.EndDate),
                    ClientData1: []
                };
            }
            acc[key].ClientData1.push({
                id: Date.now() + Math.random(),
                Client: Client.find((item) => item.SalesFlowRef == entry.Store)?._id,
                Debit: entry.DabitAmount,
                Credit: entry.CreditAmount,
            });
            return acc;
        }, {});


        const result = Object.values(mergedData);
        const result1 = result.filter(obj =>
            Object.values(obj).some(value => value === undefined)
        );
        console.log(result1)
        if (result1.length === 0) {
            console.log(result)
            const merged = Object.values(result[0].ClientData1.reduce((acc, item) => {
                if (!acc[item.Client]) {
                    acc[item.Client] = { Client: item.Client, Debit: 0, Credit: 0 };
                }
                acc[item.Client].Debit += item.Debit;
                acc[item.Client].Credit += item.Credit;
                return acc;
            }, {}));

            result[0].ClientData = merged
            result[0].status = false

            const fullData = {
                ClientData: result[0].ClientData,
                DateStart: result[0].DateStart,
                DateEnd: result[0].DateEnd,
                Status: result[0].status

            };
            const chunks = [];

            for (let i = 0; i < fullData.ClientData.length; i += CHUNK_SIZE) {
                const chunk = {
                    ...fullData,
                    ClientData: fullData.ClientData.slice(i, i + CHUNK_SIZE),
                };
                chunks.push(chunk);
            }
            try {
                console.log(chunks)
                for (const chunk of chunks) {
                    await createDataFunction("/ClientOpeningBalance", chunk);
                }
                toast.success("All data submitted successfully!");
                setTimeout(() => navigate('/ClientOpeningBalance'), 2000);
            } catch (err) {
                toast.error("Something went wrong during upload.");
                console.error(err);
            }
        } else {
            toast.error("some error forund excal dowmloaded")
            return downloadExcel(result1)
        }
    }




    const handleFileUpload = (e) => {
        setHide(true)
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Get the first worksheet
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // Convert to JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Get headers if needed
            const firstRow = XLSX.utils.sheet_to_json(worksheet, { header: 1 })[0];

            setData(jsonData);
            setHeaders(firstRow);
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <ToastContainer />
            <h2>Upload Excel File</h2>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
            />



            {data.length > 0 && (
                <div>
                    <h3>Data:</h3>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
                        <table className="min-w-full divide-y divide-gray-200 bg-white">
                            <thead className="bg-gray-50">
                                <tr>
                                    {headers.map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                    >
                                        {headers.map((header, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="whitespace-nowrap px-6 py-4 text-sm text-gray-700"
                                            >
                                                {row[header]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            )}
            <br />

            {hide && <input type="submit" onClick={onSubmit} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5' />}
        </div>
    )
}

export default ClientOpeningBalanceBulkAdd