import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateDataFunction } from '../../Api/CRUD Functions';

const SalesInvoiceReturnEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [poClient, setPoClient] = useState(null);
  const Client = useSelector((state) => state.Client.client);
  const Products = useSelector((state) => state.Product.product);
  const SalesInvoiceReturn = useSelector((state) => state.SalesInvoiceReturn.SalesInvoiceReturn);
  const findReturn = SalesInvoiceReturn.find((item) => item._id === id);
  const location = useSelector((state) => state.Location.Location);
  const Store = useSelector((state) => state.Store.Store);
  const [tableData, setTableData] = useState([]);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  useEffect(() => {
    if (findReturn) {
      // Set form values
      setValue("ReturnDate", findReturn.SalesInvoiceReturnDate);
      setValue("SalesFlowRef", findReturn.SalesFlowRef || "");
      setValue("Damage", findReturn.Damage || "Fresh");
      
      // Set client
      const client = Client.find((item) => item._id === findReturn.Client);
      if (client) {
        setPoClient({
          label: `${client.CutomerName} ${client.code}`,
          value: client._id
        });
      }
      
      // Set table data
      if (findReturn.SalesReturnData) {
        setTableData(findReturn.SalesReturnData.map(item => ({
          ...item,
          id: item._id || Date.now()  // Ensure each row has a unique ID
        })));
      }
    }
  }, [findReturn, Client, setValue]);

  const AllProduct = {
    options: Products.map((item) => ({ 
      value: item._id, 
      label: `${item.mastercode} ${item.ProductName}` 
    })),
  };

  const AllClient = {
    options: Client.map((item) => ({ 
      value: item._id, 
      label: `${item.CutomerName} ${item.code}` 
    })),
  };

  const addNewRow = () => {
    if (!poClient) {
      return toast.error("First select a client");
    }

    setTableData([...tableData, {
      id: Date.now(),
      product: '',
      box: 0,
      carton: 0,
      rate: 0,
      Gst: 0,
      discount: 0,
      netAmunt: 0
    }]);
  };

  const removeRow = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

  const findLocation = location.find((item) => item._id === findReturn?.Location);
  const disableLocation = findLocation ? {
    label: findLocation.LocationName,
    value: findLocation._id
  } : null;

  const findStore = Store.find((item) => item._id === findReturn?.Store);
  const disableStore = findStore ? {
    label: findStore.StoreName,
    value: findStore._id
  } : null;

  const onSubmit = async (data) => {
    if (!poClient) {
      return toast.error("Please select a client");
    }
    console.log(data)
    const payload = {
      ...data,
      Client: poClient.value,
      SalesReturnData: tableData.map(row => ({
        product: row.product,
        box: row.box,
        carton: row.carton,
        rate: row.rate,
        unit: row.unit,
        discount: row.discount,
        Gst: row.Gst,
        TotalValueExclGst: row.TotalValueExclGst,
        netAmunt: row.netAmunt,
      })),
      Location: disableLocation?.value,
      Store: disableStore?.value
    };

    try {
      console.log(payload)
      const res = await updateDataFunction(`/SalesInvoiceReturn/UpdateSalesInvoiceReturn/${id}`, payload);
      toast.success("Return updated successfully!");
      setTimeout(() => navigate('/SalesReturnList'), 1500);
      console.log(payload)
    } catch (err) {
      console.error(err);
      const error = err.response?.data?.errors;
      if (error) {
        try {
          const notAvailable = `This product not available: ${Products.find((item) => item._id === error[0])?.ProductName}`;
          toast.error(notAvailable);
        } catch {
          const notAvailable = `Qty of ${Products.find((item) => item._id === error[0][0].product)?.ProductName} Available Qty ${error[0][0].qty} you need ${error[0][0].Req} Boxes`;
          toast.error(notAvailable);
        }
      } else {
        toast.error("Failed to update return");
      }
    }
  };

  const handleCellChange = (id, field, value) => {
    setTableData(tableData.map(row => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        
        // Reset fields when product changes
        if (field === "product") {
          const findProduct = Products.find((item) => item._id === value);
          if (findProduct) {
            updatedRow.rate = findProduct.TPSale;
          }
          
          // Reset calculation fields
          updatedRow.AdvanceTax = 0;
          updatedRow.TotalValueExclGst = 0;
          updatedRow.RPValueExclGst = 0;
          updatedRow.GstonRpvalue = 0;
          updatedRow.box = 0;
          updatedRow.unit = 0;
          updatedRow.carton = 0;
          updatedRow.RPValueInclGST = 0;
          updatedRow.netAmunt = 0;
          updatedRow.discount = 0;
          updatedRow.GSTperBox = 0;
          updatedRow.GrossAmntinclGst = 0;
          updatedRow.AdvanceTax = 0;
          updatedRow.diBspass = 0;
          updatedRow.RToffer = 0;
          updatedRow.WToffer = 0;
          updatedRow.RpDrive = 0;
          updatedRow.WHOLESALEDEAL = 0;
          updatedRow.TTS = 0;
          updatedRow.Gst = 0;
          updatedRow.ValueAfterDis = 0;
        }
        
        // Handle discount fields
        if (field === "diBspass" || field === "RToffer" || field === "WToffer" || 
            field === "RpDrive" || field === "WHOLESALEDEAL") {
          updatedRow.discount = 
            (parseInt(updatedRow.diBspass) || 0) + 
            (parseInt(updatedRow.RToffer) || 0) + 
            (parseInt(updatedRow.WToffer) || 0) + 
            (parseInt(updatedRow.RpDrive) || 0) + 
            (parseInt(updatedRow.WHOLESALEDEAL) || 0);
          
          updatedRow.ValueAfterDis = 
            (parseFloat(updatedRow.Gst) || 0) + 
            (parseFloat(updatedRow.TotalValueExclGst) || 0) - 
            (parseFloat(updatedRow.discount) || 0) + 
            (parseFloat(updatedRow.AdvanceTax) || 0);
            
          updatedRow.netAmunt = 
            (parseFloat(updatedRow.ValueAfterDis) || 0) - 
            (parseFloat(updatedRow.TTS) || 0);
        }
        
        if (field === "TTS") {
          updatedRow.netAmunt = 
            (parseFloat(updatedRow.ValueAfterDis) || 0) - 
            (parseFloat(value) || 0);
        }
        
        // Handle quantity changes
        if (field === "box" || field === "carton" || field === "rate") {
          const findProduct = Products.find((item) => item._id === updatedRow.product);
          if (findProduct) {
            const BoxinCarton = parseInt(findProduct.BoxinCarton || 0);
            const PcsinBox = parseInt(findProduct.PcsinBox || 0);
            const Allunit = BoxinCarton * PcsinBox;

            // Default values if empty
            const box = parseInt(updatedRow.box || 0);
            const carton = parseInt(updatedRow.carton || 0);
            
            if (box === 0) {
              updatedRow.unit = Allunit * carton;
            } else if (carton === 0) {
              updatedRow.unit = PcsinBox * box;
            } else {
              const totalbox = box * findProduct.PcsinBox;
              updatedRow.unit = Allunit * carton + totalbox;
            }
            
            const totalBox = updatedRow.unit / findProduct.PcsinBox;
            updatedRow.ValueExclGstperBox = updatedRow.rate || findProduct.TPSale;
            updatedRow.TotalValueExclGst = totalBox * (updatedRow.rate || findProduct.TPSale);
            updatedRow.RPValueExclGst = totalBox * findProduct.RetailPrice;
            
            findProduct.SaleTaxBy === "1" 
              ? updatedRow.Gst = (updatedRow.TotalValueExclGst / 100) * parseInt(findProduct.SaleTaxPercent) 
              : updatedRow.Gst = (updatedRow.RPValueExclGst / 100) * parseInt(findProduct.SaleTaxPercent);

            updatedRow.RPValueInclGST = updatedRow.Gst + updatedRow.RPValueExclGst;
            updatedRow.GSTperBox = updatedRow.Gst / totalBox;
            updatedRow.totalBox = totalBox;
            updatedRow.GrossAmntinclGst = updatedRow.Gst + updatedRow.TotalValueExclGst;
            
            updatedRow.ValueAfterDis = 
              updatedRow.Gst + 
              updatedRow.TotalValueExclGst - 
              (parseFloat(updatedRow.discount) || 0) + 
              (parseFloat(updatedRow.AdvanceTax) || 0);
              
            updatedRow.netAmunt = 
              (parseFloat(updatedRow.ValueAfterDis) || 0) - 
              (parseFloat(updatedRow.TTS) || 0);
            
            if (!updatedRow.discount) {
              updatedRow.netAmunt = updatedRow.GrossAmntinclGst + (parseFloat(updatedRow.AdvanceTax) || 0);
            } else {
              updatedRow.netAmunt = 
                updatedRow.GrossAmntinclGst + 
                (parseFloat(updatedRow.AdvanceTax) || 0) - 
                (parseFloat(updatedRow.discount) || 0);
            }
            
            updatedRow.RPValuePerBox = updatedRow.RPValueInclGST / totalBox;
            const findClient = Client.find((item) => item._id === poClient?.value);
            if (findClient && findClient.AdvanceTaxApply === 1) {
              if (findClient.Filler === 2) {
                updatedRow.AdvanceTax = updatedRow.GrossAmntinclGst / 100 * 0.25;
              } else {
                updatedRow.AdvanceTax = updatedRow.GrossAmntinclGst / 100 * 0.05;
              }
            }
          }
        }
        
        return updatedRow;
      }
      return row;
    }));
  };

  // Calculate totals
  const totalDiscount = tableData.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0);
  const TotalValueExclGst = tableData.reduce((sum, row) => sum + (parseFloat(row.TotalValueExclGst) || 0), 0);
  const TotalGst = tableData.reduce((sum, row) => sum + (parseFloat(row.Gst) || 0), 0);
  const totalBox = tableData.reduce((sum, row) => sum + (parseInt(row.box) || 0), 0);
  const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);
  const totalUnit = tableData.reduce((sum, row) => sum + (parseInt(row.unit) || 0), 0);
  const totalnetAmunt = tableData.reduce((sum, row) => sum + (parseFloat(row.netAmunt) || 0), 0);
  const totalAdvanceTax = tableData.reduce((sum, row) => sum + (parseFloat(row.AdvanceTax) || 0), 0);

  if (!findReturn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-xl">Loading return data...</span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Edit Sales Return</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Return Date</label>
            <input
              type="date"
              defaultValue={findReturn.SalesInvoiceReturnDate}
              {...register("ReturnDate", { required: true })}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Client</label>
            <Select
              onChange={(vals) => setPoClient(vals)}
              options={AllClient.options}
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
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Return No</label>
            <input
              type="text"
              disabled
              value={findReturn.ReturnNumber || "Auto Generated"}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Reference</label>
            <input
              type="text"
              defaultValue={findReturn.SalesFlowRef || ""}
              {...register("SalesFlowRef")}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Location</label>
            <Select 
              value={disableLocation}
              isDisabled={true}
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
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Store</label>
            <Select 
              value={disableStore}
              isDisabled={true}
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
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Condition</label>
            <select 
              defaultValue={findReturn.Damage || "Fresh"}
              {...register("Condition")} 
              className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            >
              <option value="Fresh"> Fresh</option>
              <option value="Damage"> Damage</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2 min-w-[200px]">Rate</th>
                <th className="border p-2 hidden md:table-cell">Unit</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2">Box</th>
                <th className="border p-2 hidden lg:table-cell">Value Excl Gst</th>
                <th className="border p-2 hidden lg:table-cell">GST</th>
                <th className="border p-2 hidden xl:table-cell">DIS PASS</th>
                <th className="border p-2 hidden xl:table-cell">RET T</th>
                <th className="border p-2 hidden xl:table-cell">WHOL T</th>
                <th className="border p-2 hidden 2xl:table-cell">RET POW</th>
                <th className="border p-2 hidden 2xl:table-cell">WHOLE DEAL</th>
                <th className="border p-2 hidden lg:table-cell">Adv Tax</th>
                <th className="border p-2">Discount</th>
                <th className="border p-2 hidden xl:table-cell">After Disc</th>
                <th className="border p-2 hidden xl:table-cell">TTS Disc</th>
                <th className="border p-2">Net Amount</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <Select
                      menuPortalTarget={document.body}
                      styles={{
                        menuPortal: base => ({ ...base, zIndex: 9999 }),
                        control: (provided) => ({
                          ...provided,
                          minHeight: '35px',
                          fontSize: '14px'
                        })
                      }}
                      value={row.product ? {
                        value: row.product,
                        label: `${Products.find((p) => p._id === row.product)?.mastercode} ${Products.find((p) => p._id === row.product)?.ProductName}`
                      } : null}
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'product', selectedOption?.value || '')
                      }
                      options={AllProduct.options}
                      className="text-sm"
                      classNamePrefix="select"
                      placeholder="Select Product..."
                      isSearchable
                      isClearable
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.rate}
                      onChange={(e) => handleCellChange(row.id, 'rate', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden md:table-cell">{row.unit || 0}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.carton}
                      onChange={(e) => handleCellChange(row.id, 'carton', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.box}
                      onChange={(e) => handleCellChange(row.id, 'box', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden lg:table-cell">{row.TotalValueExclGst || 0.00}</td>
                  <td className="border p-2 hidden lg:table-cell">{row.Gst?.toFixed(2) || 0.00}</td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.diBspass || 0}
                      onChange={(e) => handleCellChange(row.id, 'diBspass', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.RToffer || 0}
                      onChange={(e) => handleCellChange(row.id, 'RToffer', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.WToffer || 0}
                      onChange={(e) => handleCellChange(row.id, 'WToffer', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden 2xl:table-cell">
                    <input
                      type="number"
                      value={row?.RpDrive || 0}
                      onChange={(e) => handleCellChange(row.id, 'RpDrive', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden 2xl:table-cell">
                    <input
                      type="number"
                      value={row?.WHOLESALEDEAL || 0}
                      onChange={(e) => handleCellChange(row.id, 'WHOLESALEDEAL', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden lg:table-cell">{row?.AdvanceTax?.toFixed(2) || 0.00}</td>
                  <td className="border p-2">{row?.discount || 0}</td>
                  <td className="border p-2 hidden xl:table-cell">{row?.ValueAfterDis?.toFixed(2) || 0.00}</td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.TTS || 0}
                      onChange={(e) => handleCellChange(row.id, 'TTS', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">{row?.netAmunt?.toFixed(2) || 0.00}</td>
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
            {tableData.length !== 0 && (
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
            )}
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
            Update Sales Return
          </button>
        </div>
      </form>
    </div>
  )
}

export default SalesInvoiceReturnEdit;