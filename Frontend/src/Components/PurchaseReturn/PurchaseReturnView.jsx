// PurchaseReturnView.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDataFundtion } from '../../Api/CRUD Functions';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';

const PurchaseReturnView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const Products = useSelector((state) => state.Product.product);
  const Vendor = useSelector((state) => state.Vendor.state);
  const Store = useSelector((state) => state.Store.Store);
  const location = useSelector((state) => state.Location.Location);
  const PurchaseReturns = useSelector((state) => state.PurchaseReturn.PurchaseReturn);
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail);
    const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts)

  const [data, setData] = useState(null);
  const [filterProduct, setFilterProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState([])


  useEffect(() => {
    const init = async () => {
      try {
        if (Products.length === 0) {
          const res = await getDataFundtion('/product');
          dispatch(fetchproduct(res.data));
        }

        const currentData = PurchaseReturns.find((item) => item._id === id);
        if (currentData) {
          setData(currentData);

          const vendorCode = Vendor.find(v => v._id === currentData.Vendor)?.code;
          const vendorProducts = Products.filter(p => p.mastercode.startsWith(vendorCode));
          setFilterProduct(vendorProducts);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [id]);

  if (loading || !data) return <div className="text-center py-10">Loading...</div>;

  const getProductName = (id) => {
    const p = Products.find(prod => prod._id === id);
    return p ? `${p.ProductName} ${p.mastercode}` : 'N/A';
  };

  const getVendorName = (id) => Vendor.find(v => v._id === id)?.VendorName || 'N/A';
  const getLocationName = (id) => location.find(l => l._id === id)?.LocationName || 'N/A';
  const getStoreName = (id) => Store.find(s => s._id === id)?.StoreName || 'N/A';
  const Voucher = async (id) => {
    console.log(data)
    const data1= await getDataFundtion(`/Voucher/getVoucherByNumber/Prr${data.PurchaseReturn}`)
    console.log(data1)
    setVoucherData(data1.data[0])
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className='p-4'>
        <div className='flex justify-between mb-1'>
          <h1 className="text-3xl font-bold text-center  text-gray-800 mb-2">View Purchase Return</h1>
          <button
            onClick={() => Voucher(PurchaseReturns.PurchaseReturn)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Voucher
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold">Return Date</label>
              <p className="mt-1">{data.PurchaseReturnDate?.split('T')[0]}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Vendor</label>
              <p className="mt-1">{getVendorName(data.Vendor)}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Purchase Return No</label>
              <p className="mt-1">{data.PurchaseReturn}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Sales Flow Ref</label>
              <p className="mt-1">{data.SalesFlowRef}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Location</label>
              <p className="mt-1">{getLocationName(data.Location)}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Store</label>
              <p className="mt-1">{getStoreName(data.Store)}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2">Product</th>
                  <th className="border px-4 py-2">Rate</th>
                  <th className="border px-4 py-2">Unit</th>
                  <th className="border px-4 py-2">CTN</th>
                  <th className="border px-4 py-2">Box</th>
                  <th className="border px-4 py-2">Trade Value Exc. Tax</th>
                  <th className="border px-4 py-2">Per Box Value</th>
                  <th className="border px-4 py-2">Discount</th>
                  <th className="border px-4 py-2">Value After Disc.</th>
                  <th className="border px-4 py-2">GST</th>
                  <th className="border px-4 py-2">Value with GST</th>
                  <th className="border px-4 py-2">After GST Disc.</th>
                  <th className="border px-4 py-2">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                {data.PurchaseReturnData.map((row) => (
                  <tr key={row.id}>
                    <td className="border px-4 py-2">{getProductName(row.product)}</td>
                    <td className="border px-4 py-2">{row.perBoxAmount}</td>
                    <td className="border px-4 py-2">{row.unit}</td>
                    <td className="border px-4 py-2">{row.carton}</td>
                    <td className="border px-4 py-2">{row.box}</td>
                    <td className="border px-4 py-2">{row.GrossAmount}</td>
                    <td className="border px-4 py-2">{row.PerBoxValueGrs}</td>
                    <td className="border px-4 py-2">{row.discount}</td>
                    <td className="border px-4 py-2">{row.ValueAfterDiscout}</td>
                    <td className="border px-4 py-2">{row.Gst}</td>
                    <td className="border px-4 py-2">{row.ValuewithGst}</td>
                    <td className="border px-4 py-2">{row.AfterTaxdiscount}</td>
                    <td className="border px-4 py-2">{row.netAmunt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">📄 Voucher Details</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div><strong>Voucher Number:</strong>{voucherData?.VoucherNumber}</div>
            <div><strong>Voucher Date:</strong> {voucherData?.VoucherDate}</div>
            <div><strong>Voucher Type:</strong> {voucherData?.VoucherType}</div>
            <div><strong>Status:</strong> {voucherData?.status}</div>
          </div>
        </div>

        {/* Table */}
        <div>
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

                {voucherData?.VoucharData?.map((item, index) => (

                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{Accounts.find((ac) => ac._id === item.Account)?.AccountName}({Accounts.find((ac) => ac._id === item.Account)?.AccountCode})</td>
                    <td className="px-4 py-2 border">
                      {item.Debit !== undefined ? item.Debit.toLocaleString() : '–'}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.Credit !== undefined ? item.Credit.toLocaleString() : '–'}
                    </td>
                    <td className="px-4 py-2 border"> {Store.find((st) => st._id === item.store).StoreName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PurchaseReturnView;
