import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';


const PurchaseInvoiceAdd = () => {
  const navigate = useNavigate();
  const [poVendor, setPoVendor] = useState(null);
  const Vendor = useSelector((state) => state.Vendor.state)
  const Products = useSelector((state) => state.Product.product);
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
  const Store = useSelector((state) => state.Store.Store)
  const location = useSelector((state) => state.Location.Location)
  const [filterProduct, setFilterProduct] = useState([])
  const [VendorDrp, setVendorDrp] = useState([])
  const [defVen, setDefven] = useState({})
  const [storeDrp, setStoreDrp] = useState([])
  const [selectedStore, setSelectedStore] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState('')

  const notify = () => toast("Product Duplicate In Purchase Order");

  const [tableData, setTableData] = useState([]);
  const [lginerStore, setlginerStore] = useState([])
  const [lginerlocation, setlginerlocation] = useState([])

  const AllVendor1 = Vendor.find((item) => item._id == loginVendor.Vendor[0])
  const AllVendor = { value: AllVendor1?._id, label: AllVendor1?.VendorName }
  const dispatch = useDispatch()

  const getData = async () => {
    const arrProduct = Products.length == 0 ? await getDataFundtion('/product') : Products
    Products.length == 0 ? dispatch(fetchproduct(arrProduct?.data)) : null


    if (loginVendor.userType == 1) {

      const vendor = Vendor.find((item) => item._id == loginVendor.Vendor[0])?.code
      const VendorProduct = Products.length == 0 ? arrProduct.data.filter((item) => item.mastercode.slice(0, 2) == vendor) : Products.filter((item) => item.mastercode.slice(0, 2) == vendor)
      const Userstore = Store.find((item) => item._id == loginVendor?.Store[0])
      const UserLocation = location.find((item) => item._id == loginVendor?.Location)

      setlginerlocation(UserLocation)
      setlginerStore(Userstore)
      setFilterProduct(VendorProduct)


    }
    else {
      const Userstore = Store.filter((item, index) => loginVendor?.Store[index])
      const UserLocation = location.filter((item, index) => loginVendor?.Location[index])
        .map((item1) => ({
          label: item1.LocationName,
          value: item1._id
        }
        ))
      const stores = Userstore.map((item) => ({
        label: item.StoreName,
        value: item._id
      }))
      console.log(UserLocation)
      setlginerlocation(UserLocation)


      const vendorIdSet = new Set(loginVendor.Vendor);
      const AllVendor1 = Vendor.filter(vendor =>
        vendorIdSet.has(vendor._id)
      );
      console.log(AllVendor1)
      const VenDrp = AllVendor1.map((item) => ({
        label: `${item.VendorName} ${item.code}`,
        value: item._id

      }))

      setVendorDrp(VenDrp)

    }


  }
  const SortProduct = (value) => {
    setPoVendor(value)
    console.log(Products)
    const vendor = Vendor.find((item) => item._id == value)?.code
    const VendorProduct = Products.filter((item) => item.mastercode.slice(0, 2) == vendor)
    setFilterProduct(VendorProduct)
  }

  useEffect(() => {
    getData()
  }, [])
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
  const loadInvoiceOptions = async (inputValue) => {
    if (!inputValue) return [];

    const filtered = filterProduct
      .filter((item) =>
        item.ProductName.toLowerCase().includes(inputValue.toLowerCase()) || item.mastercode.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 50); // limit to first 50 results

    return filtered.map((item) => ({
      label: `${item.ProductName} ${item.mastercode}`,
      value: item._id

    }));
  };

  const StartingProduct = filterProduct.slice(0, 50).map((item) => ({
    label: `${item.ProductName} ${item.mastercode}`,
    value: item._id
  }));;

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

  const onSubmit = async (data) => {
    loginVendor.userType == 1 ? data.Vendor = loginVendor.Vendor[0] : data.Vendor = poVendor
    data.PurchaseData = tableData
    data.VendorCode = loginVendor.userType == 1 ? Vendor.find((item) => item._id == loginVendor.Vendor).code : Vendor.find((item) => item._id == poVendor).code
    data.Location = loginVendor.userType == 1 ? lginerlocation._id : selectedLocation
    data.Store = loginVendor.userType == 1 ? lginerStore._id : selectedStore
    console.log(data)
    try {
      console.log(data)
      const res = await createDataFunction('/PurchaseInvoice', data)
      console.log(res)
      toast.success("Data Add")
      setTimeout(() => {
        navigate('/PurchaseInvoiceList')
      }, 2000)
    } catch (err) {
      toast.error("Some Thing Went Wrong")
    }

  };
  const setDrp = (value) => {
    setSelectedLocation(value)
    setStoreDrp([])
    const StoreDrp = Store?.filter((item) => item.Location == value).map((item) => {
      return { value: item._id, label: item.StoreName }
    })
    setStoreDrp(StoreDrp)
  }
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
              {...register("PurchaseInvoiceDate", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Vendor</label>
            <Select
              onChange={(vals) => SortProduct(vals.value)}
              options={loginVendor.userType == 1 ? AllVendor : VendorDrp}
              defaultValue={loginVendor.userType == 1 ? AllVendor : null}
              isDisabled={loginVendor.userType == 1 ? true : false || tableData.length != 0 ? true : false}
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              placeholder="Select Vendor..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Purchace Invoice No</label>
            <input
              type="text"
              disabled
              defaultValue={''}
              {...register("purchase")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-seumibold mb-2">Sales Flow Ref</label>
            <input
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
              defaultValue={lginerlocation?.LocationName}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> : <Select
              options={lginerlocation}
              isDisabled={tableData.length != 0 ? true : false}
              onChange={(v) => setDrp(v.value)}
            />
            }
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Store</label>
            {loginVendor.userType == 1 ? <input
              type="text"
              disabled={true}
              defaultValue={lginerStore?.StoreName}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            /> :
              <Select
                options={storeDrp}
                isDisabled={tableData.length != 0 ? true : false}
                onChange={(v) => setSelectedStore(v.value)}
                value={storeDrp.find(opt => opt.value === selectedStore) || null}
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
                <th className="border p-2">Trade Value Exc. All Taxes</th>
                <th className="border p-2">Per Box Value exclusive gst</th>
                <th className="border p-2">Discount </th>
                <th className="border p-2"> Trade Value After Discount</th>
                <th className="border p-2">Gst</th>
                <th className="border p-2">Trade Value with Gst</th>
                <th>After Gst Discount</th>
                <th className="border p-2">Net Amount </th>
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
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'product', selectedOption ? selectedOption.value : '')
                      }
                      loadOptions={loadInvoiceOptions}
                      className="basic-single"
                      classNamePrefix="select"
                      isSearchable
                      placeholder="Select Product"
                      defaultOptions={StartingProduct}
                    />
                  </td>
                  <td className="border p-2">
                    {row.unit}
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.carton}
                      onChange={(e) => handleCellChange(row.id, 'carton', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={row.box}
                      onChange={(e) => handleCellChange(row.id, 'box', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
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
                    {row.ValuewithGst}
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.AfterTaxdiscount}
                      onChange={(e) => handleCellChange(row.id, 'AfterTaxdiscount', e.target.value)}
                      className="w-full p-1 border rounded"
                    />
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
              tableData.length != 0 ? <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">Total</td>
                  <td className="border p-2">{totalUnit}</td>
                  <td className="border p-2">{totalCarton}</td>
                  <td className="border p-2">{totalBox}</td>
                  <td className="border p-2">{totalGrossAmount.toFixed(2)}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2">{totalDiscount.toFixed(2)}</td>
                  <td className="border p-2">{totalValueAfterDiscount.toFixed(2)}</td>
                  <td className="border p-2">{totalGST.toFixed(2)}</td>
                  <td className="border p-2">{totalValuewithGst.toFixed(2)}</td>
                  <td className="border p-2">{totalAfterTaxdiscount.toFixed(2)}</td>
                  <td className="border p-2">{totalNetAmount.toFixed(2)}</td>
                  <td className="border p-2"></td>
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
            Create Purchase Order
          </button>
        </div>
      </form>
    </div>
  )
}

export default PurchaseInvoiceAdd