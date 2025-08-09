import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { data, useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import { createDataFunction, getDataFundtion, updateDataFunction } from '../../Api/CRUD Functions';

const SalesinvoiceView = () => {
  const { id } = useParams();
  const Client = useSelector((state) => state.Client.client);
  const Products = useSelector((state) => state.Product.product);
  const SalesInvoice = useSelector((state) => state.SalesInvoice.SalesInvoice);
  const findInvoice = SalesInvoice.find((item) => item._id === id);
  const location = useSelector((state) => state.Location.Location)
  const Store = useSelector((state) => state.Store.Store)
  const Admin = useSelector((state) => state.AdminReducer.AdminReducer)
  const AllProduct = useSelector((state) => state.TotalProducts.TotalProducts)
  const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts);

  const [tableData, setTableData] = useState([]);
  const [voucherData, setVoucherData] = useState([])
  console.log(voucherData)
  useEffect(() => {
    if (findInvoice) {
      setTableData(findInvoice.SalesData || []);
    }
  }, [findInvoice]);

  const findClient = Client.find((item) => item._id === findInvoice?.Client);
  const defultClient = {
    label: findClient?.CutomerName,
    value: findClient?._id,
  };
  const navigate = useNavigate()
  const getVoucherData = async () => {

    const data = await getDataFundtion(`/Voucher/getVoucherByNumber/Sl${findInvoice.SalesInvoice}`)
    console.log(data)
    setVoucherData(data.data[0])
  }
  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">View Sales Invoice</h1>
      {findInvoice?.PostStatus == true ? (
        <div className="flex justify-end mb-4 space-x-4">
          <button
            className="bg-blue-400 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
            onClick={getVoucherData}
          >
            Show Voucher
          </button>
        </div>
      ) : null}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sale Date</label>
            <div className="p-2 bg-gray-100 rounded">{findInvoice?.SalesInvoiceDate || '-'}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
            <div className="p-2 bg-gray-100 rounded">{defultClient?.label || '-'}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Invoice No</label>
            <div className="p-2 bg-gray-100 rounded">{findInvoice?.SalesInvoice || '-'}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Sales Flow Ref</label>
            <div className="p-2 bg-gray-100 rounded">{findInvoice?.SalesFlowRef || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <div className="p-2 bg-gray-100 rounded">{location.find((item) => item._id == findInvoice?.Location).LocationName || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Store</label>
            <div className="p-2 bg-gray-100 rounded">{Store.find((item) => item._id == findInvoice?.Store)?.StoreName || '-'}</div>
          </div>
        </div>


        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">Carton</th>
                <th className="border p-2">Box</th>
                <th className="border p-2">Value Excl GST</th>
                <th className="border p-2">GST</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2">Advance Tax</th>
                <th className="border p-2">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row, index) => {
                const product = Products.find((p) => p._id === row.product);
                return (
                  <tr key={row.id || index} className="hover:bg-gray-50">
                    <td className="border p-2">{product ? `${product.mastercode} ${product.ProductName}` : '-'}</td>
                    <td className="border p-2">{row.unit || 0}</td>
                    <td className="border p-2">{row.carton || 0}</td>
                    <td className="border p-2">{row.box || 0}</td>
                    <td className="border p-2">{row.TotalValueExclGst?.toFixed(2) || 0}</td>
                    <td className="border p-2">{row.Gst?.toFixed(2) || 0}</td>
                    <td className="border p-2">{row.discount?.toFixed(2) || 0}</td>
                    <td className="border p-2">{row.AdvanceTax?.toFixed(2) || 0}</td>
                    <td className="border p-2">{row.netAmunt?.toFixed(2) || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {voucherData.length !== 0 ?
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto mt-[5vw]">
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">📄 Voucher Details</h2>
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div><strong>Voucher Number:</strong>{voucherData.VoucherNumber}</div>
              <div><strong>Voucher Date:</strong> {voucherData.VoucherDate}</div>
              <div><strong>Voucher Type:</strong> {voucherData.VoucherType}</div>
              <div><strong>Status:</strong> {voucherData.status}</div>
            </div>
          </div>

          {/* Table */}
          <div className=''>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Voucher Entries</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Account</th>
                    <th className="px-4 py-2 border">Debit</th>
                    <th className="px-4 py-2 border">Credit</th>
                    <th className="px-4 py-2 border">Store</th>
                  </tr>
                </thead>
                <tbody>

                  {voucherData.VoucharData?.map((item, index) => (

                    <tr key={index} className="text-center hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{Accounts.find((ac) => ac._id === item.Account)?.AccountName}({Accounts.find((ac) => ac._id === item.Account)?.AccountCode})</td>
                      <td className="px-4 py-2 border">
                        {item.Debit !== undefined ? item.Debit.toLocaleString() : '–'}
                      </td>
                      <td className="px-4 py-2 border">
                        {item.Credit !== undefined ? item.Credit.toLocaleString() : '–'}
                      </td>
                      <td className="px-4 py-2 border"> {Store.find((st) => st._id === item.Store).StoreName}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <td className="px-4 py-2 border"> </td>
                  <td className="px-4  border text-center font-bold text-[20px] py-[5px]">Total </td>
                  <td className="px-4 py-2 border text-center">{voucherData.VoucharData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0)} </td>
                  <td className="px-4 py-2 border text-center">{voucherData.VoucharData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0)} </td>


                </tfoot>
              </table>
            </div>
          </div>
        </div>
        : null}
    </div>
  )
}

export default SalesinvoiceView