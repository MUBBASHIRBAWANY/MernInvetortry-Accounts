import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { toast, ToastContainer } from 'react-toastify';

const OpeningInventoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [openingInventory, setOpeningInventory] = useState({});

  const Products = useSelector((state) => state.Product.product);
  const Stores = useSelector((state) => state.Store.Store);
  const Locations = useSelector((state) => state.Location.Location);

  const editOpeningInventory = useSelector((state) => state.Openinginventory.Openinginventory);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const data = editOpeningInventory.find((item) => item._id === id);
    if (data) {
      setOpeningInventory(data);
      setTableData(data.InvoetoryData || []);
    }
  }, [id, editOpeningInventory]);

  const getProductName = (productId) => {
    const product = Products.find((p) => p._id === productId);
    return product ? `${product.mastercode} ${product.ProductName}` : 'Unknown Product';
  };

  const getLocationName = (LocationId) => {
    const Location = Locations.find((L) => L._id === LocationId);
    return Location ? `${Location.LocationName}` : 'Unknown Location';
  };
  const getStoreName = (StoreId) => {
    const Store = Stores.find((L) => L._id === StoreId);
    return Store ? `${Store.StoreName}` : 'Unknown Store';
  };
  const totalOpeningQty = tableData.reduce((sum, row) => sum + (parseFloat(row.opneingQty) || 0), 0);
  const totalValueExclGst = tableData.reduce((sum, row) => sum + (parseFloat(row.opneingQtyValueExclGst) || 0), 0);
  const totalValueInclGst = tableData.reduce((sum, row) => sum + (parseFloat(row.opneingQtyValueInclGst) || 0), 0);

  const handleStatusChange = async (newStatus) => {
    console.log(tableData)
    try {
      const res = await updateDataFunction(`Openinginventory/ChnageStatusOnly/${id}`, {
        status: newStatus,
      });
      console.log(res)
      toast.success("Status Update")
      setTimeout(() => {
        navigate('/OpeningInventory')
      }, 2000)


    } catch (err) {
      console.error('Status update failed', err);
    }
  };

  return (

    <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">
        Opening Inventory Details
      </h1>

      {/* Top Buttons for Status */}
      <div className="flex flex-wrap justify-center gap-4 mb-6">
        {openingInventory.Status === 'Open' && (
          <button
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
            onClick={() => handleStatusChange('Closed')}
          >
            Close
          </button>
        )}
        {openingInventory.Status === 'Closed' && (
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => handleStatusChange('Unpost')}
          >
            Unpost
          </button>
        )}
        {openingInventory.Status !== 'Open' && (
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={() => handleStatusChange('Open')}
          >
            Open
          </button>
        )}
      </div>

      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">
              Year From
            </label>
            <div className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-50">
              {openingInventory.DateStart || 'N/A'}
            </div>
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">
              Year To
            </label>
            <div className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-50">
              {openingInventory.DateEnd || 'N/A'}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2">Opening Qty</th>
                <th className="border p-2">Value Excl Gst</th>
                <th className="border p-2">Value incl Gst</th>
                <th className="border p-2">Store</th>
                <th className="border p-2">Location</th>
                <th className="border p-2">Type </th>


              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {getProductName(row.product)}
                  </td>
                  <td className="border p-2">
                    {row.opneingQty}
                  </td>
                  <td className="border p-2">
                    {parseFloat(row.opneingQtyValueExclGst).toFixed(5)}
                  </td>
                  <td className="border p-2">
                    {parseFloat(row.opneingQtyValueInclGst).toFixed(5)}
                  </td>
                  <td className="border p-2">
                    {getStoreName(row.Store)}
                  </td>
                  <td className="border p-2">
                    {getLocationName(row.Location)}
                  </td>
                  <td className="border p-2">{row.Type} </td>
                </tr>
              ))}
            </tbody>
            {tableData.length > 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2 text-right">Total:</td>
                  <td className="border p-2">{totalOpeningQty}</td>
                  <td className="border p-2">{totalValueExclGst}</td>
                  <td className="border p-2"> {totalValueInclGst}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>


                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <button
          type="button"
          onClick={() => navigate('/OpeningInventory')}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm md:text-base"
        >
          Back to List
        </button>
      </div>
    </div>
  );
};

export default OpeningInventoryView;
