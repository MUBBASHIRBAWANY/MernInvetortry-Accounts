import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { toast, ToastContainer } from 'react-toastify';

const StockReplacementEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, reset } = useForm();

  const StockReplacementList = useSelector((state) => state.StockReplacement.StockReplacement);
  const currentData = StockReplacementList.find(item => item._id === id);

  const Store = useSelector((state) => state.Store.Store);
  const location = useSelector((state) => state.Location.Location);
  const Customer = useSelector((state) => state.Client?.client);
  const Vendor = useSelector((state) => state.Vendor.state);
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail);
  const AllProducts = useSelector((state) => state.Product.product);

  const [CustomerTo, setCustomerTo] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [ReplaceStore, setReplaceStore] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [Products, setProducts] = useState(AllProducts || []);

  const Location = location
    .filter(item => loginVendor.Location.includes(item._id))
    .map((item) => ({ label: item.LocationName, value: item._id }));

  const storeDrp = Store
    .filter(s => s.Location === selectedLocation && loginVendor.Store.includes(s._id))
    .map((s) => ({ label: s.StoreName, value: s._id }));

  const loadclients = async (inputValue) => {
    const vendorIdSet = new Set(loginVendor.Vendor);
    const AllClient = Customer.filter(customer =>
      customer.Vendor.some(vendorId => vendorIdSet.has(vendorId))
    );
    const filtered = AllClient.filter(item =>
      item.CutomerName.toLowerCase().includes(inputValue.toLowerCase()) ||
      item.code.toLowerCase().includes(inputValue.toLowerCase())
    ).slice(0, 50);
    return filtered.map(item => ({
      label: `${item.CutomerName} ${item.code}`,
      value: item._id
    }));
  };
  console.log(tableData)

  const handleCellChange = (id, field, value) => {
    setTableData(tableData.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        const checking = tableData.find(item => item.id === id);
        // Product selection
        if (field === "productTo") {
          updatedRow.productTo = value.value;
          updatedRow.boxTo = 0;
          updatedRow.cartonTo = 0;
          updatedRow.unitTo = 0;
          updatedRow.totalBoxesTo = 0;
          updatedRow.ToValue = 0;
        }


        if (field === "productFrom") {
          updatedRow.productFrom = value.value;
          updatedRow.productTo = value.value;
          if (checking.productFrom !== value) {
            updatedRow.boxFrom = 0;
            updatedRow.cartonFrom = 0;
            updatedRow.unitFrom = 0;
            updatedRow.fromValue = 0;
            updatedRow.totalBoxesFrom = 0;
            updatedRow.Reason = "Damage"


          }
        }

        // Reset fields if product not selected
        if (!updatedRow.productFrom) {
          updatedRow.boxFrom = 0;
          updatedRow.cartonFrom = 0;
          updatedRow.unitFrom = 0;
          updatedRow.totalBoxesFrom = 0;
          updatedRow.fromValue = 0;
          updatedRow.totalBoxes = 0;

        }
        if (!updatedRow.productTo) {
          updatedRow.boxTo = 0;
          updatedRow.totalBoxesTo = 0;
          updatedRow.cartonTo = 0;
          updatedRow.unitTo = 0;
          updatedRow.ToValue = 0;
        }

        if (field === "Reason") {
          updatedRow.Reason = value
        }
        if (["cartonFrom", "boxFrom", "unitFrom"].includes(field)) {
          const findProduct = Products.find(item => item._id === updatedRow.productFrom);
          if (findProduct) {
            const BoxinCarton = parseInt(findProduct.BoxinCarton || 0);
            const PcsinBox = parseInt(findProduct.PcsinBox || 0);
            const TPSale = parseFloat(findProduct.TPSale || 0);

            const carton = parseInt(updatedRow.cartonFrom || 0);
            const box = parseInt(updatedRow.boxFrom || 0);
            const unit = parseInt(updatedRow.unitFrom || 0);

            const totalUnits = (carton * BoxinCarton * PcsinBox) + (box * PcsinBox) + unit;
            const totalBoxes = totalUnits / PcsinBox;

            updatedRow.totalBoxesFrom = totalBoxes;

            // Value: use unit price = TPSale / PcsinBox
            const unitRate = TPSale / PcsinBox;
            updatedRow.fromValue = parseFloat((unitRate * totalUnits).toFixed(2));
          }
        }

        // To side box/carton/unit logic
        if (["cartonTo", "boxTo", "unitTo"].includes(field)) {
          const findProduct = Products.find(item => item._id === updatedRow.productTo);
          if (findProduct) {
            const BoxinCarton = parseInt(findProduct.BoxinCarton || 0);
            const PcsinBox = parseInt(findProduct.PcsinBox || 0);
            const TPSale = parseFloat(findProduct.TPSale || 0);
            const carton = parseInt(updatedRow.cartonTo || 0);
            const box = parseInt(updatedRow.boxTo || 0);
            const unit = parseInt(updatedRow.unitTo || 0);
            const totalUnits = (carton * BoxinCarton * PcsinBox) + (box * PcsinBox) + unit;
            const totalBoxes = totalUnits / PcsinBox;
            updatedRow.totalBoxesTo = totalBoxes;
            updatedRow.ToValue = parseFloat((TPSale * totalBoxes).toFixed(2));
          }
        }



        return updatedRow;
      }
      return row;
    }));
  };
    const removeRow = (id) => {
        setTableData(tableData.filter(row => row.id !== id));
    };

    const loadProductOptions = async (inputValue) => {
        const selectedClient = Customer.find((item) => item._id == CustomerTo.value).Vendor
        const filterVendor = selectedClient.filter(value => loginVendor.Vendor.includes(value));
        const SelectedClientVendor = Vendor.filter((item) => filterVendor.some(prefix => item._id.startsWith(prefix)))
            .map((code) => code.code)
        const product = Products.filter(product =>
            SelectedClientVendor.some(prefix => product.mastercode.startsWith(prefix))
        )
            .map((p) => ({
                label: `${p.ProductName} ${p.mastercode}`,
                value: p._id
            }))
        if (!inputValue) return [];
        const AllProduct = product

        const filtered = AllProduct
            .filter((item) =>
                item.label.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results
        return filtered.map((item) => ({
            label: item.label,
            value: item.value
        }));

    };
  const addNewRow = () => {
    if (!Customer) {
      return toast.error("first Select CustomerFrom & CustomerTo ")
    }
    setTableData([...tableData, {
      id: Date.now(),
      productFrom: '',
      productTo: '',
      boxFrom: 0,
      cartonFrom: 0,
      boxTo: 0,
      cartonTo: 0,
      unitFrom: 0,
      unitTo: 0,
      ToValue: 0,
      fromValue: 0,
      Reason: ""

    }]);


  };

  useEffect(() => {
    if (currentData) {
      reset({
        ReplacementDate: currentData.ReplacementDate,
        SalesFlowRef: currentData.SalesFlowRef,
        StockNo: currentData.ReplacementNumber
      });

      const customer = Customer.find(c => c._id === currentData.Customer);
      if (customer) {
        setCustomerTo({
          value: customer._id,
          label: `${customer.CutomerName} ${customer.code}`
        });
      }

      setSelectedLocation(currentData.Location);

      const matchedStore = Store.find(s => s._id === currentData.Store);
      if (matchedStore) {
        setReplaceStore({
          value: matchedStore._id,
          label: matchedStore.StoreName
        });
      }

      setTableData(currentData.ReplacementData || []);
    }
  }, [currentData, reset, Customer, Store]);

  const onSubmit = async (data) => {
    data.ReplacementData = tableData;
    data.Customer = CustomerTo?.value;
    data.Location = selectedLocation;
    data.Store = ReplaceStore?.value;

    try {
      await updateDataFunction(`/StockReplacement/UpdateStockReplacement/${id}`, data);
      toast.success('Updated Successfully');
      setTimeout(() => navigate('/StockReplacement'), 2000);
    } catch (err) {
      console.error(err);
      toast.error('Failed to update');
    }
  };

  if (!currentData) return <div className="p-4">Loading...</div>;

  return (
    <div className='mx-5'>
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Edit Stock Replacement</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Replacement Date</label>
            <input
              type="date"
              {...register("ReplacementDate", { required: true })}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Customer</label>
            <AsyncSelect
              value={CustomerTo}
              loadOptions={loadclients}
              isDisabled={true}
              className="basic-single text-sm"
              classNamePrefix="select"
              styles={{ control: (base) => ({ ...base, minHeight: '40px', fontSize: '14px' }) }}
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Sales Flow Ref</label>
            <input
              type="text"
              {...register("SalesFlowRef")}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Replacement No</label>
            <input
              type="text"
              disabled
              {...register("StockNo")}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Location</label>
            <Select value={Location.find(l => l.value === selectedLocation)} isDisabled />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Store</label>
            <Select value={ReplaceStore} isDisabled />
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[150px]">Product From </th>
                <th className="border p-2 hidden md:table-cell">Total Box</th>
                <th className="border p-2 hidden md:table-cell">Unit From</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2 hidden lg:table-cell">Box</th>
                <th className="border p-2">Value Excl Gst</th>
                <th className="border p-2 min-w-[150px]">Product To</th>
                <th className="border p-2 lg:table-cell hidden md:table-cell">Total Box</th>
                <th className="border p-2 lg:table-cell hidden md:table-cell">Unit</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2 hidden md:table-cell" >Box</th>
                <th className="border p-2 ">Value Excl Gst</th>
                <th className="border p-2 ">Reason</th>

                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <AsyncSelect
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      cacheOptions
                      loadOptions={loadProductOptions}
                      value={row.productFrom ? {
                        value: `${row.productFrom} }`,
                        label: `${Products.find((p) => p._id === row.productFrom)?.mastercode} ${Products.find((p) => p._id === row.productFrom)?.ProductName}`
                      } : null}
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'productFrom', selectedOption || '')
                      }
                      className="text-sm"
                      classNamePrefix="select"
                      placeholder="Select Product..."
                      isSearchable
                      isClearable
                    />
                  </td>
                  <td className="border p-2 hidden md:table-cell">{row.totalBoxesFrom || 0}</td>
                  <td className="border p-2 w-[5vw]">
                    <input
                      type="number"
                      value={row.unitFrom}
                      onChange={(e) => handleCellChange(row.id, 'unitFrom', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded "
                    />
                  </td>
                  <td className="border p-2 w-[5vw]">
                    <input
                      type="number"
                      value={row.cartonFrom}
                      onChange={(e) => handleCellChange(row.id, 'cartonFrom', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded "
                    />
                  </td>
                  <td className="border p-2 w-[5vw]">
                    <input
                      type="number"
                      value={row.boxFrom}
                      onChange={(e) => handleCellChange(row.id, 'boxFrom', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded "
                    />
                  </td>

                  <td className="border p-2 ">
                    {row.fromValue}
                  </td>
                  <td className="border p-2 w-[15vw]">
                    <AsyncSelect
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      cacheOptions
                      loadOptions={loadProductOptions}
                      value={row.productTo ? {
                        value: `${row.productTo} }`,
                        label: `${Products.find((p) => p._id === row.productTo)?.mastercode} ${Products.find((p) => p._id === row.productTo)?.ProductName}`
                      } : null}
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'productTo', selectedOption || '')
                      }
                      className="text-sm"
                      classNamePrefix="select"
                      placeholder="Select Product..."
                      isSearchable
                      isClearable
                    />
                  </td>
                  <td className="border p-2 hidden md:table-cell">{row.totalBoxesTo || 0}</td>
                  <td className="border p-2 w-[5vw]">
                    <input
                      type="number"
                      value={row.unitTo}
                      onChange={(e) => handleCellChange(row.id, 'unitTo', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded "
                    />
                  </td>
                  <td className="border p-2 w-[5vw]">
                    <input
                      type="number"
                      value={row.cartonTo}
                      onChange={(e) => handleCellChange(row.id, 'cartonTo', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden md:table-cell w-[5vw]">
                    <input
                      type="number"
                      value={row.boxTo}
                      onChange={(e) => handleCellChange(row.id, 'boxTo', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    {row.ToValue}
                  </td>
                  <td className="border p-2">
                    <select name="" onChange={(e) => handleCellChange(row.id, "Reason", e.target.value)} id="" className='w-full p-1 text-xs md:text-sm border border-r-red-500 rounded'>
                      <option value="Damge">Damage</option>
                      <option value="Expire">Expire</option>
                    </select>
                  </td>
                  <td className="border p-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* {tableData.length !== 0 && (
                            <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2">Total</td>
                                    <td className="border p-2 hidden md:table-cell">{totalUnit}</td>
                                    <td className="border p-2">{totalCarton}</td>
                                    <td className="border p-2">{totalBox}</td>
                                    <td className="border p-2 hidden lg:table-cell">{TotalValueExclGst?.toFixed(2)}</td>
                                    <td className="border p-2 hidden lg:table-cell">{TotalGst?.toFixed(2)}</td>
                                    <td className="border p-2 hidden xl:table-cell"></td>
                                    <td className="border p-2 hidden xl:table-cell"></td>
                                    <td className="border p-2 hidden xl:table-cell"></td>
                                    <td className="border p-2 hidden 2xl:table-cell"></td>
                                    <td className="border p-2 hidden 2xl:table-cell"></td>
                                    <td className="border p-2 hidden lg:table-cell">{totalAdvanceTax?.toFixed(2)}</td>
                                    <td className="border p-2">{totalDiscount?.toFixed(2)}</td>
                                    <td className="border p-2 hidden xl:table-cell"></td>
                                    <td className="border p-2 hidden xl:table-cell"></td>
                                    <td className="border p-2">{totalnetAmunt?.toFixed(2)}</td>
                                    <td className="border p-2"></td>
                                </tr>
                            </tfoot>
                        )} */}
          </table>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={addNewRow}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm md:text-base"
          >
            Add Row
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
          >
            Create Stock Replacement
          </button>
        </div>
      </form>
    </div>
  );
};

export default StockReplacementEdit;
