import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import { ConvetDate } from '../Global/getDate';
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import { validateSales, validateSalesData } from '../Global/CheckUndefind';

const SalesReturnBulkAdd = () => {
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
                    Condition : entry.Condition,
                    SalesInvoiceReturnDate: entry.Date,
                    SalesData: [],
                    Location: Location.find((item) => item.LocationName == entry.Location)?._id,
                    Store: Store.find((item) => item.StoreName == entry.Store)?._id,
                    OrderBooker: OrderBooker.find((item) => item.salesFlowRef == entry.OrderBookerCode)?._id
                };
            }
            acc[key].SalesData.push({
                id: Date.now() + Math.random(),
                product: Products.find((item) => item.CodeRef === entry.Vendor + entry.SKU)?._id,
                totalBox: Math.abs(entry.SalesBoxes),
                TotalValueExclGst: Math.abs(entry.TPExcGST),
                unit: Math.abs(Products.find((item) => item.CodeRef == entry.Vendor + entry.SKU)?.PcsinBox * entry.SalesBoxes),
                GrossAmntinclGst: Math.abs(entry.TPIncGST),
                AdvanceTax: Math.abs(entry.AdvanceTax),
                diBspass: Math.abs(entry.DISTRIBUTORPASSON || 0),
                RToffer: Math.abs(entry.RETAILTRADEOFFERS || 0),
                WToffer: Math.abs(entry.WHOLESALETRADEOFFERS || 0),
                RpDrive: Math.abs(entry.RETAILPOWERDRIVE || 0),
                WHOLESALEDEAL: Math.abs(entry.WHOLESALEDEAL || 0),
                discount: (entry?.DISTRIBUTORPASSON ?? 0) + (entry.RETAILTRADEOFFERS ?? 0) + (entry.WHOLESALETRADEOFFERS ?? 0) + (entry.RETAILPOWERDRIVE ?? 0) + (entry.WHOLESALEDEAL ?? 0),
                netAmunt: Math.abs(entry.NetSales),
                TTS: Math.abs(entry.TTS ?? 0),
                Gst: Math.abs(entry.GST),
                box: Math.abs(entry.SalesBoxes),
                ValueAfterDis: Math.abs(entry.GST + entry.TPExcGST - (entry?.DISTRIBUTORPASSON ?? 0) + (entry.RETAILTRADEOFFERS ?? 0) + (entry.WHOLESALETRADEOFFERS ?? 0) + (entry.RETAILPOWERDRIVE ?? 0) + (entry.WHOLESALEDEAL ?? 0))
            });
            return acc;
        }, {});

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
            console.log(result)

            const postInChunks = async (data, chunkSize = 10) => {
                console.log(data)

                const chunks = [];
                for (let i = 0; i < data.length; i += chunkSize) {
                    chunks.push(data.slice(i, i + chunkSize));
                }

                try {
                    for (const chunk of chunks) {
                        const res = await createDataFunction("/SalesInvoiceReturn/PushinBulk", { Returninvoices: chunk });
                        console.log(res)
                    }
                    toast.success("All data added successfully");
                    setTimeout(() => navigate('/SalesReturnList'), 5000);
                } catch (err) {
                    console.error("Error in chunk:", err);
                    toast.error("Partial data added - some chunks failed");
                }
            };
            postInChunks(result)
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
        <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Create Sales Invoice</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Sale Date</label>
            <input
              type="date"
              {...register("SaleInvoiceDate", { required: true })}
              className="w-full px-3 py-3 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Client</label>
            <AsyncSelect
              onChange={(vals) => getDataDc(vals)}
              loadOptions={loadclients}
              defaultOptions={startingClient}
              value={poClient}
              className="basic-single text-sm"
              classNamePrefix="select"
              isSearchable
              isDisabled={tableData.length === 0 ? false : true}
              placeholder="Select customer..."
              styles={{
                control: (provided) => ({
                  ...provided,
                  minHeight: '40px',
                  fontSize: '14px'
                })
              }}
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Invoice No</label>
            <input
              type="text"
              disabled
              defaultValue={''}
              {...register("salesInvoice")}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
            />
          </div>


          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Dc Number</label>
            <Select onChange={(v) => setDrp(v)} options={DcClient} isDisabled={tableData.length === 0 ? false : true} />
          </div>

        </div>
        <div className="flex flex-cols-1 lg:flex-cols-2 gap-5 mb-6">
          {/* Add Account Card */}

        </div>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2 hidden lg:table-cell">Rate</th>
                <th className="border p-2 hidden xl:table-cell">Total Amount</th>
                <th className="border p-2 hidden xl:table-cell">Discount</th>
                <th className="border p-2 hidden lg:table-cell">GST</th>
                <th className="border p-2">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {Products.find((item) => item._id == row.product).ProductName}
                  </td>
                  <td className="border p-2">
                    {row.carton}
                  </td>

                  <td className="border p-2 hidden lg:table-cell">
                    <input
                      type="number"
                      value={row?.Rate}
                      onChange={(e) => handleCellChange(row.id, 'Rate', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 ">
                    {row.TotalAmount || 0}
                  </td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.Discount || 0}
                      onChange={(e) => handleCellChange(row.id, 'Discount', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden lg:table-cell">{row.Gst || 0.00}</td>
                  <td className="border p-2 hidden xl:table-cell">
                    {row.netAmunt}
                  </td>
                </tr>
              ))}
            </tbody>
            {tableData.length !== 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">Total</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>

                </tr>
              </tfoot>
            )}
          </table>

        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-between">

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
          >
            Create Sale Invoice
          </button>
        </div>
        <div className='flex justify-end gap-2'>
          <div className="bg-gradient-to-br from-rose-50 to-white min-w-[24vw] p-3 rounded-lg border border-rose-100 shadow space-y-3">

            {/* Net Amount */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-rose-600">Net Amount:</label>
              <span className="text-sm font-bold text-rose-600">{totalAmount}</span>
            </div>

            {/* Less Account Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Less Account</span>

              <AsyncSelect
                menuPortalTarget={document.body}
                onChange={(selectedOption) => setlessAccount(selectedOption?.value)}
                loadOptions={loadAccounts}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#fff1f2',
                    borderColor: '#fecdd3',
                    minHeight: '32px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#fda4af' }
                  })
                }}
                defaultOptions={startingAccount}
                isClearable={true}
                className="text-xs min-w-[14vw] max-w-[14vw]"
                classNamePrefix="select"
                isSearchable
                placeholder="Select..."
              />

              <span className="text-sm font-medium text-gray-700">Amt</span>
              <input
                type="number"
                {...register("LessAmount")}
                onChange={(e) => setLessAmount(e.target.value)}
                placeholder="0"
                className="w-[6vw] px-2 py-1 text-xs text-right bg-rose-50 border border-rose-200 rounded focus:ring-1 focus:ring-rose-300 focus:border-rose-400 focus:outline-none transition"
              />
            </div>

            {/* Add Account Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Add Account</span>

              <AsyncSelect
                menuPortalTarget={document.body}
                onChange={(selectedOption) => setAddAccount(selectedOption?.value)}
                loadOptions={loadAccounts}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#fff1f2',
                    borderColor: '#fecdd3',
                    minHeight: '32px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#fda4af' }
                  })
                }}
                defaultOptions={startingAccount}
                isClearable={true}
                className="text-xs min-w-[14vw]"
                classNamePrefix="select"
                isSearchable
                placeholder="Select..."
              />

              <span className="text-sm font-medium text-gray-700">Amt</span>
              <input
                type="number"
                {...register("AddAmount")}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0"
                className="w-[6vw] px-2 py-1 text-xs text-right bg-rose-50 border border-rose-200 rounded focus:ring-1 focus:ring-rose-300 focus:border-rose-400 focus:outline-none transition"
              />
            </div>

            {/* Total Net Amount */}
            <div className="pt-2 border-t border-rose-100">
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-gray-800">Total Net:</span>
                <span className="text-sm font-bold text-rose-600">{totalNetAmount}</span>
              </div>
            </div>
          </div>
        </div>


      </form>
    </div>
    )
}

export default SalesReturnBulkAdd