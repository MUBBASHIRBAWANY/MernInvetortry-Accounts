import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import { ConvetDate } from '../../Components/Global/getDate';
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import { validateSales, validateSalesData } from '../Global/CheckUndefind';

const SalesInvoiceBulkAdd = () => {
    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([]);
    const Client = useSelector((state) => state.Client.client)
    const Product1 = useSelector((state) => state.Product.product);
    const OrderBooker = useSelector((state) => state.OrderBooker.OrderBooker)
    const Location = useSelector((state) => state.Location.Location);
    const Store = useSelector((state) => state.Store.Store)
    const [Products, setProducts] = useState([])
    const navigate = useNavigate()
    const [hide, setHide] = useState(false)
    const getData = async () => {
        if (Product1.length == 0) {
            const data = await getDataFundtion('/product')
            setProducts(data.data)
        } else {
            await setProducts(Product1)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    const downloadExcel = (data, filename = 'data.xlsx') => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, filename);
    };


    const findVendor = (id) => {
        console.log(id)
        const ven = Vendor.find((item) => item.salesFlowRef == id)?._id
        return (ven)
    }



    const onSubmit = async () => {

        const mergedData = data.reduce((acc, entry) => {

            const key = entry.InvoiceNumber;
            if (!acc[key]) {
                acc[key] = {
                    Client: Client.find((item) => item.SalesFlowRef == entry.OutletCode)?._id,
                    SalesFlowRef: key,
                    SalesInvoiceDate: entry.Date,
                    SalesData: [],
                    Location: Location.find((item) => item.LocationName == entry.Location)?._id,
                    Store: Store.find((item) => item.StoreName == entry.Store)?._id,
                    OrderBooker: OrderBooker.find((item) => item.salesFlowRef == entry.OrderBookerCode)?._id,
                    TotalAmount : entry.NetSales.reduce((sum, row) => sum + (parseFloat(entry.NetSales) || 0), 0)
                };

                if (entry.TPIncGST < 0 || entry.SalesBoxes < 0 || entry.FOCBoxes < 0) {
                    return toast.error(`${entry.InvoiceNumber} has Amount and boxes in negative`)
                }
            }
            acc[key].SalesData.push({
                id: Date.now() + Math.random(),
                product: Products.find((item) => item.CodeRef === entry.Vendor + entry.SKU)?._id,
                totalBox : entry.SalesBoxes == 0 ? entry.FOCBoxes :  entry.SalesBoxes,
                TotalValueExclGst: entry.TPExcGST,
                unit: Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?.PcsinBox * entry.SalesBoxes == 0 ? entry.FOCBoxes :  entry.SalesBoxes,
                GrossAmntinclGst: entry.TPIncGST,
                AdvanceTax: entry.AdvanceTax,
                diBspass: entry.DISTRIBUTORPASSON || 0,
                RToffer: entry.RETAILTRADEOFFERS || 0,
                WToffer: entry.WHOLESALETRADEOFFERS || 0,
                RpDrive: entry.RETAILPOWERDRIVE || 0,
                WHOLESALEDEAL: entry.WHOLESALEDEAL || 0,
                discount: (entry?.DISTRIBUTORPASSON ?? 0) + (entry.RETAILTRADEOFFERS ?? 0) + (entry.WHOLESALETRADEOFFERS ?? 0) + (entry.RETAILPOWERDRIVE ?? 0) + (entry.WHOLESALEDEAL ?? 0),
                netAmunt: entry.NetSales,
                TTS: entry.TTS ?? 0,
                Gst: entry.GST,
                box: entry.SalesBoxes == 0 ? entry.FOCBoxes :  entry.SalesBoxes,
                ValueAfterDis: entry.GST + entry.TPExcGST - (entry?.DISTRIBUTORPASSON ?? 0) + (entry.RETAILTRADEOFFERS ?? 0) + (entry.WHOLESALETRADEOFFERS ?? 0) + (entry.RETAILPOWERDRIVE ?? 0) + (entry.WHOLESALEDEAL ?? 0)
            });
            return acc;
        }, {});
        console.log(mergedData)
        const result = Object.values(mergedData);
        const rus = validateSales(result)
        console.log(result)
        if (rus.length !== 0) {
            toast.error('Some Error found Excal file Has been download')
            downloadExcel(rus)

        } else {
            const SalesDataValid = validateSalesData(result)
            console.log(SalesDataValid)
            if (SalesDataValid.length != 0) {
                toast.error('Some Error found Excal file Has been download')
                return downloadExcel(SalesDataValid)

            }
            

            const postInChunks = async (data, chunkSize = 4) => {
                console.log(data)

                const chunks = [];
                for (let i = 0; i < data.length; i += chunkSize) {
                    chunks.push(data.slice(i, i + chunkSize));
                }

                try {
                    for (const chunk of chunks) {
                        const res = await createDataFunction("/SaleInvoice/PushinBulk", { invoices: chunk });
                        console.log(res)
                    }
                    toast.success("All data added successfully");
                    setTimeout(() => navigate('/SalesInvoice'), 5000);
                } catch (err) {
                    console.error("Error in chunk:", err);
                    toast.error("Partial data added - some chunks failed");
                }
            };
            postInChunks(result)
        }
    }





    const handleFileUpload = (e) => {
        console.log(e)
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



            {/* {data.length > 0 && (
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

            )} */}
            <br />

            {hide && <input type="submit" onClick={onSubmit} className='text-white bg-blue-700 cursor-pointer hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-[5%] mx-5 my-5' />}
        </div>
    )
}

export default SalesInvoiceBulkAdd