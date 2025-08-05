import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
const PurchaseInvoiceEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [poVendor, setPoVendor] = useState(null);
  const Vendor = useSelector((state) => state.Vendor.state)
  const Products = useSelector((state) => state.Product.product);
  const notify = () => toast("Product Duplicate In Purchase Order");
  const PurchaseInvoice = useSelector((state) => state.PurchaseInvoice.PurchaseInvoice)
  const [tableData, setTableData] = useState([]);
  const editInvoice = PurchaseInvoice.find((item) => item._id == id)
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
  const [lginerlocation, setlginerlocation] = useState([])
  const [storeDrp, setStoreDrp] = useState([])
  const [LocationDrp , setLoctionDrp] = useState([])
  const [purchasStore, setPurchaseStore] = useState([])
  const [purchaseLoction , setPurchaseLoction] = useState([])
  const [selectedLocation , setSelectedLocation] = useState([])
  const Store = useSelector((state) => state.Store.Store)
  const location = useSelector((state) => state.Location.Location)
  console.log(purchasStore)
  const AllProduct = {
    options: Products.map((item) => ({ value: item._id, label: `${item.code} ${item.ProductName}` })),
  };

  const AllVendor = {
    options: Vendor.map((item) => ({ value: item._id, label: item.VendorName })),
  };

  const { register, handleSubmit, formState: { errors } } = useForm();

  const addNewRow = () => {
    setTableData([...tableData, {
      id: Date.now(),
      product: '',
      box: 0,
      carton: 0,
      Gst: 0
    }]);
  };

  const removeRow = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

   const handleCellChange = (id, field, value) => {

    setTableData(tableData.map(row => {
      if (row.id === id) {

        const updatedRow = { ...row, [field]: value };
        const checking = tableData.find((item) => item.id == id)
        if (field == "product") {
          if (checking.product != value) {
            updatedRow.inclGstAmnt = ""
            updatedRow.netAmunt = ""
            updatedRow.perBoxAmount = ""
            updatedRow.PerBoxValueGrs = ""
            updatedRow.box = 0
            updatedRow.unit = 0
            updatedRow.carton = 0
            updatedRow.GrossAmount = ""
            updatedRow.Gst = ''
            updatedRow.discount = ''
            updatedRow.AfterTaxdiscount = 0
          }

        }
        if (updatedRow.product == "") {
          updatedRow.inclGstAmnt = ""
          updatedRow.netAmunt = ""
          updatedRow.perBoxAmount = ""
          updatedRow.PerBoxValueGrs = ""
          updatedRow.box = ""
          updatedRow.unit = ""
          updatedRow.carton = ''
          updatedRow.GrossAmount = ""
          updatedRow.Gst = ''
          updatedRow.AfterTaxdiscount = 0
        }

        const findProduct = Products.find((item) => item._id === updatedRow.product);
        if (field == "product") {
          updatedRow.unit == 0
        }
        if (field == "discount") {
          updatedRow.ValueAfterDiscout = updatedRow.GrossAmount - updatedRow.discount
          updatedRow.Gst = parseFloat(updatedRow.ValueAfterDiscout / 100 * findProduct.SaleTaxPercent).toFixed(4)
          console.log()
          updatedRow.ValuewithGst = parseFloat(Number(updatedRow.ValueAfterDiscout) + Number(updatedRow.Gst)).toFixed(4)
          updatedRow.netAmunt = updatedRow.ValuewithGst
          updatedRow.AdvanceTax = parseFloat((updatedRow.netAmunt / 100) * 0.1).toFixed(4)
          updatedRow.netAmuntWithAdvnaceTax = parseFloat(Number(updatedRow.netAmunt) + Number(updatedRow.AdvanceTax)).toFixed(4)
        }
        if (field == "AfterTaxdiscount") {
          updatedRow.netAmunt = updatedRow.ValuewithGst - updatedRow.AfterTaxdiscount
          updatedRow.AdvanceTax = parseFloat((updatedRow.netAmunt / 100) * 0.1).toFixed(4)
          updatedRow.netAmuntWithAdvnaceTax = parseFloat(Number(updatedRow.netAmunt) + Number(updatedRow.AdvanceTax)).toFixed(4)
       
        }

        if (field === "box" || field === "carton") {
          console.log(findProduct)
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
              const totalbox = box * findProduct.PcsinBox
              updatedRow.unit = Allunit * carton + totalbox;
            }
            const boxPrice = (updatedRow.unit / findProduct.PcsinBox)
            updatedRow.GrossAmount = (boxPrice * findProduct.TPPurchase)
            const totalBox = updatedRow.unit / findProduct.PcsinBox
            console.log(totalBox)
            updatedRow.perBoxAmount = updatedRow.inclGstAmnt / totalBox - row.discount
            updatedRow.RetailValue = findProduct.RetailPrice * totalBox
            updatedRow.PerBoxValueGrs = updatedRow.GrossAmount / totalBox
            updatedRow.ValueAfterDiscout = updatedRow.GrossAmount - row.discount
            findProduct.SaleTaxBy == 2 ? updatedRow.Gst = updatedRow.RetailValue / 100 * findProduct.SaleTaxPercent : updatedRow.Gst = updatedRow.GrossAmount / 100 * findProduct.SaleTaxPercent - updatedRow.discount
            updatedRow.ValuewithGst = updatedRow.Gst + updatedRow.ValueAfterDiscout
            updatedRow.netAmunt = parseFloat(updatedRow.ValuewithGst - updatedRow.AfterTaxdiscount).toFixed(4)
            updatedRow.AdvanceTax = parseFloat((updatedRow.netAmunt / 100) * 0.1).toFixed(4)
            updatedRow.netAmuntWithAdvnaceTax = parseFloat(Number(updatedRow.netAmunt) + Number(updatedRow.AdvanceTax)).toFixed(5)
            updatedRow.totalBox = totalBox

          }

        }
        return updatedRow;
      }
      return row;
    }));
  };

   const totalDiscount = tableData.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0);
  const totalGST = tableData.reduce((sum, row) => sum + (parseFloat(row.Gst) || 0), 0);
  const totalNetAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.netAmunt) || 0), 0);
  const totalBox = tableData.reduce((sum, row) => sum + (parseInt(row.box) || 0), 0);
  const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);
  const totalUnit = tableData.reduce((sum, row) => sum + (parseInt(row.unit) || 0), 0);
  const totalGrossAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.GrossAmount) || 0), 0);
  const totalValueAfterDiscount = tableData.reduce((sum, row) => sum + (parseFloat(row.ValueAfterDiscout) || 0), 0);
  const totalValuewithGst = tableData.reduce((sum, row) => sum + (parseFloat(row.ValuewithGst) || 0), 0);
  const totalAfterTaxdiscount = tableData.reduce((sum, row) => sum + (parseFloat(row.AfterTaxdiscount) || 0), 0);
  const totalAdvanceTax = tableData.reduce((sum, row) => sum + (parseFloat(row.AdvanceTax) || 0), 0);

  console.log(editInvoice)
  const selectVendor = Vendor.find((item) => item._id == editInvoice?.Vendor)
  const defaultVendor = {
    value: selectVendor?._id,
    label: `${selectVendor?.VendorName} ${selectVendor?.code}`
  }


const setDrp = (value) =>{
  setPurchaseLoction(value)
  const values = value.value;
  setSelectedLocation(values);
  setPurchaseStore([]); 
  const updatedStoreDrp = Store?.filter(item => values.includes(item.Location))
    .map(item => ({
      value: item._id,
      label: item.StoreName,
    }));
  setStoreDrp(updatedStoreDrp);

  }

  const onSubmit = async (data) => {
    data.Vendor = poVendor
    data.PurchaseData = tableData
    try {
      console.log(data)
      updateDataFunction(`/PurchaseInvoice/PurchaseInvoiceUpdate/${id}`, data)
      toast.success("Data Add")
      setTimeout(() => {
        navigate('/PurchaseInvoiceList')
      }, 2000)
    } catch (err) {
      toast.error("Some Thing Went Wrong")
    }

  };
  const AllProducts = Products.map((product) => ({
    value: product._id,
    label: `${product.mastercode} ${product.ProductName}`,
  }))

  const getData = () => {
    setTableData(editInvoice?.PurchaseData)

    const findStore = Store.find((item) => item._id == editInvoice?.Store)
    const PurchaseStore = {
      label: findStore?.StoreName,
      value: findStore?._id
    }
    setPurchaseStore(PurchaseStore)
    const stores = Store.filter((item)=> item.Location === editInvoice?.Location)
    const defultStore = stores.map((item)=> ({
      label : item?.StoreName,
      value : item?._id  
    }))

    const findLocation =  location.find((item)=> item?._id ==  editInvoice?.Location)
    const PurchaseLocation = {
      label : findLocation?.LocationName,
      value : findLocation?._id
    }
    setPurchaseLoction(PurchaseLocation)
    setStoreDrp(defultStore)

    const UserLocation = location.filter((item, index) => loginVendor?.Location[index])
      .map((item1)=>({
        label : item1?.LocationName,
        value : item1?._id
      }
      ))
      console.log(loginVendor)
      setLoctionDrp(UserLocation)

  }

  useEffect(() => {
    getData()
  }, [])
  
  return (
    <div className=" p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Purchase Invoice </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Purchase Date</label>
            <input
              type="date"
              defaultValue={editInvoice?.PurchaseInvoiceDate}
              {...register("PurchaseInvoiceDate", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Vendor</label>
            <Select
              isDisabled={true}
              onChange={(vals) => setPoVendor(vals.value)}
              defaultValue={defaultVendor}
              options={AllVendor?.options}
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              placeholder="Select customer..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Purchace Invoice No</label>
            <input
              type="text"
              disabled
              defaultValue={editInvoice?.PurchaseInvoice}
              {...register("purchase")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref</label>
            <input
              defaultValue={editInvoice?.SalesFlowRef}
              type="text"
              {...register("SalesFlowRef")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            {loginVendor.userType == 1 ? <input
              type="text"
              disabled={true}
              defaultValue={purchaseLoction.label}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> : <Select
              options={LocationDrp}
              isDisabled={tableData?.length != 0 ? true : false}
              onChange={(v) => setDrp(v)}
              value={purchaseLoction}
            />
            }
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Store</label>
            {loginVendor.userType == 1 ? <input
              type="text"
              disabled={true} 
              defaultValue={purchasStore.label}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> :
              <Select
                options={storeDrp}
                value={purchasStore || null}
                isDisabled={tableData?.length != 0 ? true : false}
                onChange={(v) => {
                  setSelectedStore(v.value);
                  setPurchaseStore(v);  
                }}
              />
            }
          </div>
        </div>

        {/* Excel-like Table */}
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-36">Product</th>
                <th className="border p-2">Unit</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2">Box</th>
                <th className="border p-2">RetailValue</th>
                <th className="border p-2">Trade Value Exc. All Taxes</th>
                <th className="border p-2">Per Box Value exclusive gst</th>
                <th className="border p-2">Discount </th>
                <th className="border p-2"> Trade Value After Discount</th>
                <th className="border p-2">Gst</th>
                <th className="border p-2">Net Amount </th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <Select
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      value={
                        row.product
                          ? {
                            value: row.product,
                            label:
                              `${Products.find((p) => p._id === row.product).mastercode} ${Products.find((p) => p._id === row.product).ProductName}` || '',
                          }
                          : null
                      }
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'product', selectedOption ? selectedOption.value : '')
                      }
                      options={AllProducts}
                      className="w-full"
                      classNamePrefix="select"
                      placeholder="Select Product..."
                      isSearchable
                      isClearable
                    />
                  </td>
                  <td className="border p-2">
                    {row.unit}
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      pattern="^[1-9]\d*$"
                      title="Only positive integers allowed (no leading zeros)"
                      value={row.carton}
                      onChange={(e) => handleCellChange(row.id, 'carton', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      title="Only positive integers allowed (no leading zeros)"
                      value={row.box}
                      onChange={(e) => handleCellChange(row.id, 'box', e.target.value)}
                      pattern="^[1-9]\d*$"
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    {row.RetailValue}
                  </td>
                  <td className="border p-2">
                    {row.GrossAmount}
                  </td>
                  <td className="border p-2">
                    {row.PerBoxValueGrs}
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.discount}
                      onChange={(e) => handleCellChange(row.id, 'discount', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className='border p-2'>
                    {row.ValueAfterDiscout}
                  </td>
                  <td className="border p-2">
                    {row.Gst}
                  </td>
                  <td className="border p-2">
                    {row.netAmunt}
                  </td>

                  <td className="border p-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>

              ))
              }

            </tbody>
            {
              tableData?.length != 0 ? <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">Total</td>
                  <td className="border p-2">{totalUnit}</td>
                  <td className="border p-2">{totalCarton}</td>
                  <td className="border p-2">{totalBox}</td>
                  <td className="border p-2">{totalRetailValue?.toFixed(2)}</td>
                  <td className="border p-2">{totalGrossAmount?.toFixed(2)}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2">{totalDiscount?.toFixed(2)}</td>
                  <td className="border p-2">{totalValueAfterDiscount?.toFixed(2)}</td>
                  <td className="border p-2">{totalGST?.toFixed(2)}</td>
                  <td className="border p-2">{totalNetAmount?.toFixed(2)}</td>
                  <td className="border p-2"></td>
                </tr>
              </tfoot> : null
            }
          </table>
        </div>

        <div className="flex  justify-between">
          <button
            type="button"
            onClick={addNewRow}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add Row
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Edit Purchase Invoice
          </button>
        </div>
      </form>
    </div>
  )
}

export default PurchaseInvoiceEdit