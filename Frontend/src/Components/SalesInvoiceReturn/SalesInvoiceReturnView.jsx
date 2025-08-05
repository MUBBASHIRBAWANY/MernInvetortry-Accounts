import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';

const SalesInvoiceReturnView = () => {
  const { id } = useParams();
  const Clients = useSelector((state) => state.Client.client);
  const Products = useSelector((state) => state.Product.product);
  const SalesReturns = useSelector((state) => state.SalesInvoiceReturn.SalesInvoiceReturn);
  const Locations = useSelector((state) => state.Location.Location);
  const Stores = useSelector((state) => state.Store.Store);

  const findReturn = SalesReturns.find((item) => item._id === id);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (findReturn) {
      setTableData(findReturn.SalesReturnData || []);
    }
  }, [findReturn]);

  const findClient = Clients.find((item) => item._id === findReturn?.Client);
  const findLocation = Locations.find((item) => item._id === findReturn?.Location);
  const findStore = Stores.find((item) => item._id === findReturn?.Store);
const navigate = useNavigate()
  const handlePostStatusChange = async (status) => {
    console.log(status)
    try {
      const payload = {
        SalesReturnNumber: findReturn.SalesReturnNumber,
        Store: findReturn.Store,
        Location: findReturn.Location,
        id: findReturn._id,
        status,
        SalesReturnData: findReturn.SalesReturnData,
        Condition: findReturn.Condition
      };
      console.log(payload)
      const res = await updateDataFunction(`/SalesInvoiceReturn/ChangeStatus/${id}`, payload);
      toast.success(status ? 'Posted successfully' : 'Unposted successfully');
      setTimeout((navigate('/SalesReturnList'),
    5000))
    } catch (err) {
      const error = err?.response?.data?.errors;
      if (error) {
        try {
          const productName = Products.find((item) => item._id == error[0])?.ProductName || 'Unknown';
          toast.error(`This product not available: ${productName}`);
        } catch {
          const errorDetails = error[0][0];
          const productName = Products.find((item) => item._id == errorDetails.product)?.ProductName || 'Unknown';
          toast.error(`Qty of ${productName} available: ${errorDetails.qty}, required: ${errorDetails.Req} Boxes`);
        }
      }
    }
  };

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        View Sales Invoice Return
      </h1>

      {findReturn?.PostStatus === false ? (
        <div className="flex justify-end mb-4 space-x-4">
          <button
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
            onClick={() => handlePostStatusChange(true)}
          >
            Post
          </button>
        </div>
      ) : (
        <div className="flex justify-end mb-4 space-x-4">
          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition duration-300"
            onClick={() => handlePostStatusChange(false)}
          >
            Unpost
          </button>
        </div>
      )}

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Return Date</label>
            <div className="p-2 bg-gray-100 rounded">{findReturn?.SalesInvoiceReturnDate || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Client</label>
            <div className="p-2 bg-gray-100 rounded">
              {findClient ? `${findClient.CutomerName} ${findClient.code}` : '-'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Return No</label>
            <div className="p-2 bg-gray-100 rounded">{findReturn?.SalesReturnNumber || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Reference</label>
            <div className="p-2 bg-gray-100 rounded">{findReturn?.SalesFlowRef || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
            <div className="p-2 bg-gray-100 rounded">{findLocation?.LocationName || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Store</label>
            <div className="p-2 bg-gray-100 rounded">{findStore?.StoreName || '-'}</div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Condition</label>
            <div className="p-2 bg-gray-100 rounded">{findReturn?.Damage || 'Fresh'}</div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2">Rate</th>
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
                    <td className="border p-2">
                      {product ? `${product.mastercode} ${product.ProductName}` : '-'}
                    </td>
                    <td className="border p-2">{row.rate || 0}</td>
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
    </div>
  );
};

export default SalesInvoiceReturnView;
