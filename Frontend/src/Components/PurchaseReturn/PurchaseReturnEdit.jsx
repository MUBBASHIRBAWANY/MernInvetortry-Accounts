import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion, updateDataFunction } from '../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';

const PurchaseReturnEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [poVendor, setPoVendor] = useState(null);
  const Vendor = useSelector((state) => state.Vendor.state)
  const Products = useSelector((state) => state.Product.product);
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
  const Store = useSelector((state) => state.Store.Store)
  const location = useSelector((state) => state.Location.Location)
  const TotalProducts = useSelector((state) => state.TotalProducts.TotalProducts);
  const [filterProduct, setFilterProduct] = useState([])
  const [VendorDrp, setVendorDrp] = useState([])
  const [storeDrp, setStoreDrp] = useState([])
  const [selectedStore, setSelectedStore] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [isLoading, setIsLoading] = useState(true);

  const notify = () => toast("Product Duplicate In Purchase Order");

  const [tableData, setTableData] = useState([]);
  const [lginerStore, setlginerStore] = useState([])
  const [lginerlocation, setlginerlocation] = useState([])

  const AllVendor1 = Vendor.find((item) => item._id == loginVendor.Vendor[0])
  const AllVendor = { value: AllVendor1?._id, label: AllVendor1?.VendorName }
  const PurchaseReturns = useSelector((state) => state.PurchaseReturn.PurchaseReturn)
  const dispatch = useDispatch()

  const getData = async () => {
    try {
      setIsLoading(true);
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
      } else {
        const Userstore = Store.filter((item, index) => loginVendor?.Store[index])
        const UserLocation = location.filter((item, index) => loginVendor?.Location[index])
          .map((item1) => ({
            label: item1.LocationName,
            value: item1._id
          }))
        const stores = Userstore.map((item) => ({
          label: item.StoreName,
          value: item._id
        }))
        setlginerlocation(UserLocation)

        const vendorIdSet = new Set(loginVendor.Vendor);
        const AllVendor1 = Vendor.filter(vendor =>
          vendorIdSet.has(vendor._id)
        )
        const VenDrp = AllVendor1.map((item) => ({
          label: `${item.VendorName} ${item.code}`,
          value: item._id
        }))
        setVendorDrp(VenDrp)
      }

      // Fetch existing data if in edit mode
      if (id) {
        const data = PurchaseReturns.find((item) => item._id == id)
        console.log(data)

        setTableData(data.PurchaseReturnData)

        reset({
          PurchaseReturnDate: data.PurchaseReturnDate?.split('T')[0],
          SalesFlowRef: data.SalesFlowRef,
          purchase: data.PurchaseReturn
        });

        // Set states
        if (loginVendor.userType !== 1) {
          setPoVendor(data.Vendor);
          setSelectedLocation(data.Location);
          setSelectedStore(data.Store);
          SortProduct(data.Vendor);
          setDrp(data.Location);
        }

        // Set table data
        setTableData(data.PurchaseReturnData || []);
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  }

  const SortProduct = (value) => {
    setPoVendor(value)
    const vendor = Vendor.find((item) => item._id == value)?.code
    const VendorProduct = Products.filter((item) => item.mastercode.slice(0, 2) == vendor)
    setFilterProduct(VendorProduct)
  }

  useEffect(() => {
    getData()
  }, [])



  const handleCellChange = (id, field, value) => {

    setTableData(tableData.map(row => {
      if (row.id === id) {

        const updatedRow = { ...row, [field]: value };
        const checking = tableData.find((item) => item.id == id)
        if (field == "Condition") {

          updatedRow.Condition = value
        }
        if (field == "product") {

          if (checking.product != value) {
            updatedRow.inclGstAmnt = ""
            updatedRow.netAmunt = ""
            updatedRow.PerBoxValueGrs = ""
            updatedRow.box = 0
            updatedRow.unit = 0
            updatedRow.carton = 0
            updatedRow.GrossAmount = ""
            updatedRow.Gst = ''
            updatedRow.discount = ''
            updatedRow.AfterTaxdiscount = ''
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
          updatedRow.AfterTaxdiscount = ''
        }

        const findProduct = Products.find((item) => item._id === updatedRow.product);
        if (field == "product") {
          updatedRow.perBoxAmount = parseFloat(TotalProducts.find((item) => item.ProductName == updatedRow.product && item.Location == selectedLocation && item.Store == selectedStore)?.AvgRate).toFixed(5) || 0;
          console.log(updatedRow.perBoxAmount)
          updatedRow.unit == 0
          updatedRow.Condition = "Fresh"
        }

        if (field == "discount") {
          updatedRow.ValueAfterDiscout = updatedRow.GrossAmount - updatedRow.discount

          updatedRow.ValuewithGst = updatedRow.Gst + updatedRow.ValueAfterDiscout
          updatedRow.netAmunt = updatedRow.ValuewithGst
        }
        if (field == "AfterTaxdiscount") {
          updatedRow.netAmunt = updatedRow.ValuewithGst - updatedRow.AfterTaxdiscount
        }

        if (field === "box" || field === "carton") {
          if (findProduct) {
            const BoxinCarton = parseInt(findProduct.BoxinCarton || 0);
            const PcsinBox = parseInt(findProduct.PcsinBox || 0);
            const Allunit = BoxinCarton * PcsinBox;
            updatedRow.discount = 0
            updatedRow.AfterTaxdiscount = 0
            updatedRow.ValuewithGst = ""
            updatedRow.netAmunt = ""
            updatedRow.ValueAfterDiscout = ""

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

            const totalBox = updatedRow.unit / findProduct.PcsinBox
            updatedRow.GrossAmount = updatedRow.perBoxAmount * totalBox
            updatedRow.ValueAfterDiscout = updatedRow.GrossAmount - row.discount
            updatedRow.RetailValue = findProduct.RetailPrice
            findProduct.SaleTaxBy == 2 ? (updatedRow.Gst = updatedRow.RetailValue / 100 * findProduct.SaleTaxPercent * totalBox) : updatedRow.Gst = updatedRow.GrossAmount / 100 * findProduct.SaleTaxPercent
            updatedRow.ValuewithGst = updatedRow.Gst + updatedRow.ValueAfterDiscout
            updatedRow.totalBox = totalBox

          }

        }
        if (field == "PerBoxValueGrs") {
          updatedRow.perBoxAmount = value;
          updatedRow.PerBoxValueGrs = value;

          const totalBox = updatedRow.unit / findProduct.PcsinBox;
          updatedRow.totalBox = totalBox;

          updatedRow.GrossAmount = value * totalBox;

          updatedRow.ValueAfterDiscout = updatedRow.GrossAmount - row.discount;

          updatedRow.RetailValue = findProduct.RetailPrice;

          if (findProduct.SaleTaxBy == 2) {
            updatedRow.Gst = (updatedRow.RetailValue / 100) * findProduct.SaleTaxPercent * totalBox;
          } else {
            updatedRow.Gst = (updatedRow.GrossAmount / 100) * findProduct.SaleTaxPercent;
          }

        }
        updatedRow.ValuewithGst = parseFloat(updatedRow.Gst + updatedRow.ValueAfterDiscout).toFixed(4);
        updatedRow.netAmunt = parseFloat(updatedRow.ValuewithGst - updatedRow.AfterTaxdiscount).toFixed(4);
        updatedRow.AdvanceTax = parseFloat((updatedRow.netAmunt / 100) * 0.1).toFixed(4)
        updatedRow.NetAmountWintAdvanceTax = parseFloat(Number(updatedRow.netAmunt) + Number(updatedRow.AdvanceTax)).toFixed(4)
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
  // Totals calculation remains same as original

  const onSubmit = async (data) => {
    loginVendor.userType == 1 ? data.Vendor = loginVendor.Vendor[0] : data.Vendor = poVendor
    data.PurchaseReturnData = tableData
    try {
      console.log(data)
      const res = await updateDataFunction(`/PurchaseReturn/PurchaseReturnUpdate/${id}`, data)
      console.log(res)
      setTimeout(() => {
        toast.success("data updated successfully")
      }, 2000)

    } catch (err) {
      toast.error("Something Went Wrong");
    }
  };

  const setDrp = (value) => {
    setSelectedLocation(value);
    setStoreDrp([]);
    const userStore = loginVendor.Store
    const updatedStoreDrp = Store?.filter(item => value.includes(item.Location))
      .filter(store => userStore.includes(store._id))
      .map((st) => ({
        label: st.StoreName,
        value: st._id
      }))

    setStoreDrp(updatedStoreDrp);
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className=" p-4">
      <ToastContainer />
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        {id ? 'Edit' : 'Create'} Purchase Return
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Return Date</label>
            <input
              type="date"
              {...register("PurchaseReturnDate", { required: true })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Vendor</label>
            <Select
              onChange={(vals) => SortProduct(vals.value)}
              options={loginVendor.userType == 1 ? AllVendor : VendorDrp}
              value={VendorDrp.find(opt => opt.value === poVendor) || null}
              defaultValue={loginVendor.userType == 1 ? AllVendor : null}
              isDisabled={loginVendor.userType == 1 || tableData.length !== 0}
              className="basic-single"
              classNamePrefix="select"
              isSearchable
              placeholder="Select Vendor..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Purchase Return No</label>
            <input
              type="text"
              disabled
              {...register("purchase")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Sales Flow Ref</label>
            <input
              type="text"
              {...register("SalesFlowRef")}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            {loginVendor.userType == 1 ? (
              <input
                type="text"
                disabled
                value={lginerlocation?.LocationName}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <Select
                options={lginerlocation}
                value={lginerlocation.find(opt => opt.value === selectedLocation) || null}
                isDisabled={tableData.length !== 0}
                onChange={(v) => setDrp(v.value)}
              />
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Store</label>
            {loginVendor.userType == 1 ? (
              <input
                type="text"
                disabled
                value={lginerStore?.StoreName}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <Select
                options={storeDrp}
                value={storeDrp.find(opt => opt.value === selectedStore) || null}
                isDisabled={tableData.length !== 0}
                onChange={(v) => setSelectedStore(v.value)}
              />
            )}
          </div>
        </div>
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-36">Product</th>
                <th className="border p-2">Rate</th>
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
                      defaultValue={getProductOption(row.product)}
                      cacheOptions
                      isClearable
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
                    <input
                      type="text"
                      value={row.perBoxAmount}
                      onChange={(e) => handleCellChange(row.id, 'PerBoxValueGrs', e.target.value)}
                      className="w-full p-1 border rounded"
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
                  <select name="" onChange={(e) => handleCellChange(row.id, "Condition", e.target.value)} id="" className='w-full p-1 text-xs md:text-sm border border-r-red-500 rounded'>
                    <option value="Fresh">Fresh</option>
                    <option value="Damage">Damage</option>
                  </select>
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
                  <td className="border p-2"></td>
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
            Create Purchase Return
          </button>
        </div>
      </form>
    </div>
  )
}

export default PurchaseReturnEdit;