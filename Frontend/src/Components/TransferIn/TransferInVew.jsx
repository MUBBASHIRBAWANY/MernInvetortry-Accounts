import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { set } from 'react-hook-form';

const TransferInView = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const Store = useSelector(state => state.Store.Store);
  const Location = useSelector(state => state.Location.Location);
  const Products = useSelector(state => state.Product.product);
  const TransferIn = useSelector(state => state.TransferIn.TransferIn);
  
  const [transfer, setTransfer] = useState(null);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const found = TransferIn.find(item => item._id === id);
    if (found) {
      setTransfer(found);
      setTableData(found.TransferData || []);
    }
  }, [id, TransferIn]);

  const getProductName = (pid) => {
    const prod = Products.find(p => p._id === pid);
    return prod ? `${prod.mastercode} ${prod.ProductName}` : pid;
  };

  const handlePostUnpost = async (status) => {
    try {
      const payload = {
        status: "Recived",
        TransferData: transfer.TransferData,
        LocationTo: transfer.LocationTo,
        StoreTo: transfer.StoreTo,
        TransferCode: transfer.TransferCode,
        TransferInDate: transfer.TransferInDate,
        SalesFlowRef: transfer.SalesFlowRef
      };
      console.log(payload)
      
      const res = await updateDataFunction(`TransferIn/ChangeStatus/${transfer._id}`, payload);
      console.log(res)
      toast.success(`Transfer Recived Successfully`);
      setTimeout(() => {
        navigate('/TransferInList');  
      }, 3000);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to ${status ? 'post' : 'unpost'} transfer.`);
    }
  };
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Transfer In Details</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => navigate('/TransferInList')}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Back to List
          </button>
          {transfer && (
            <>
              <button
                onClick={() => handlePostUnpost(true)}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Recived
              </button>
              
            </>
          )}
          </div>
      </div>

      {transfer && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              ["Transfer Code", transfer.TransferCode],
              ["Transfer Date", new Date(transfer.TransferInDate).toLocaleDateString('en-GB')],
              ["Location From", Location.find(l => l._id === transfer.LocationFrom)?.LocationName],
              ["Location To", Location.find(l => l._id === transfer.LocationTo)?.LocationName],
              ["Store From", Store.find(l => l._id === transfer.StoreFrom)?.StoreName],
              ["Store To", Store.find(l => l._id === transfer.StoreTo)?.StoreName],

            ].map(([label, value]) => (
              <div className="space-y-2" key={label}>
                <label className="block text-sm font-semibold text-gray-600">{label}</label>
                <p className="text-lg font-medium text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Product', 'Carton', 'Box', 'Unit', 'Rate', 'Gross Amount'].map(h => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {getProductName(row.product)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.carton}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.box}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{row.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{Number(row.Rate).toFixed(4)}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{Number(row.GrossAmount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferInView;
