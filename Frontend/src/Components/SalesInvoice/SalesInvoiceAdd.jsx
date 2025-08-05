import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction } from '../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';
import Select from 'react-select'



const SalesInvoiceAdd = () => {
  const navigate = useNavigate();
  const [poClient, setPoClient] = useState(null);
  const [filterProduct, setFilterProduct] = useState([])
  const Client = useSelector((state) => state.Client.client)
  const Products = useSelector((state) => state.Product.product);
  const Vendor = useSelector((state) => state.Vendor.state)
  const location = useSelector((state) => state.Location.Location)
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
  const Store = useSelector((state) => state.Store.Store)
  const [AllProduct, SetAllProduct] = useState([])
  const [tableData, setTableData] = useState([]);
  const [totalProduct, setTotalProduct] = useState([])
  const [selectedLocation, setSelectedLocation] = useState([])
  const [salesLoction, setSalesLoction] = useState([])
  const [salesStore, setSalesStore] = useState([])
  const [storeDrp, setStoreDrp] = useState([])

  const AllVendor = Vendor.filter((item, index) => loginVendor.Vendor[index])
    .map((item1) => (item1.code))
  console.log(loginVendor.Vendor)

  const vendorIdSet = new Set(loginVendor.Vendor);
  const AllClient = Client.filter(customer =>
    customer.Vendor.some(vendorId => vendorIdSet.has(vendorId))
  );
  console.log(AllClient)


  const Location = location.filter(item => loginVendor.Location.includes(item._id))
    .map((item) => ({
      label: item.LocationName,
      value: item._id
    }))

  const { register, handleSubmit, formState: { errors } } = useForm();

  const addNewRow = () => {
    if (!poClient) {
      return toast.error("first Select Client ")
    }

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
    console.log(field)
    setTableData(tableData.map(row => {
      if (row.id === id) {

        const updatedRow = { ...row, [field]: value };
        updatedRow.product = updatedRow.product.value || updatedRow.product
        const checking = tableData.find((item) => item.id == id)
        if (field == "product") {
          if (checking.product != value) {
            updatedRow.AdvanceTax = 0
            updatedRow.TotalValueExclGst = ''
            updatedRow.RPValueExclGst = ''
            updatedRow.GstonRpvalue = 0
            updatedRow.box = 0
            updatedRow.unit = 0
            updatedRow.carton = 0
            updatedRow.RPValueInclGST = 0
            updatedRow.netAmunt = 0
            updatedRow.discount = 0
            updatedRow.GSTperBox = 0
            updatedRow.GrossAmntinclGst = 0
            updatedRow.AdvanceTax = 0
            updatedRow.diBspass = 0
            updatedRow.RToffer = 0
            updatedRow.WToffer = 0
            updatedRow.RpDrive = 0
            updatedRow.WHOLESALEDEAL = 0
            updatedRow.TTS = 0
            updatedRow.Gst = 0;
            updatedRow.ValueAfterDis = 0
            updatedRow.NetAmountWithAdvanceTax = "0"

          }
        }
        if (updatedRow.product == "") {
          updatedRow.netAmunt = ""
          updatedRow.NetAmountWithAdvanceTax = ""
          updatedRow.AdvanceTax = ""
          updatedRow.discount = ""
          updatedRow.ValueExclGstperBox = ""
          updatedRow.TotalValueExclGst = ''
          updatedRow.RPValueExclGst = ''
          updatedRow.GstonRpvalue = ""
          updatedRow.box = ""
          updatedRow.unit = ""
          updatedRow.carton = ''
          updatedRow.RPValueInclGST = ""
          updatedRow.GSTperBox = ""
          updatedRow.GrossAmntinclGst = ""
          updatedRow.AdvanceTax = ""
          updatedRow.diBspass = ""
          updatedRow.RToffer = ""
          updatedRow.WToffer = ""
          updatedRow.RpDrive = ""
          updatedRow.WHOLESALEDEAL = ""
          updatedRow.TTS = "";
          updatedRow.Gst = "";
          updatedRow.ValueAfterDis = ""
        }
        const findProduct = Products.find((item) => item._id === updatedRow.product);
        if (field == "product") {
          updatedRow.unit == 0
        }
        if (field == "diBspass" || field == "RToffer" || field == "WToffer" || field == "RpDrive" || field == "WHOLESALEDEAL") {
          console.log("updatedRow.TotalValueExclGst", updatedRow.TotalValueExclGst)
          updatedRow.discount = (Number(updatedRow.diBspass) + Number(updatedRow.RToffer) + Number(updatedRow.WToffer) + Number(updatedRow.RpDrive) + Number(updatedRow.WHOLESALEDEAL) || 0)
          findProduct.SaleTaxBy == 2 ? updatedRow.Gst = ((updatedRow.TotalValueExclGst - updatedRow.discount)) / 100 * findProduct.SaleTaxPercent : updatedRow.Gst = (((findProduct.TPSale * updatedRow.totalBox) - updatedRow.discount) / 100 * findProduct.SaleTaxPercent)
          updatedRow.ValueAfterDis = updatedRow.Gst + updatedRow.TotalValueExclGst - updatedRow.discount
          updatedRow.netAmunt = updatedRow.ValueAfterDis - updatedRow.TTS
          updatedRow.NetAmountWithAdvanceTax = updatedRow.AdvanceTax + updatedRow.netAmunt



        }
        if (field == "TTS") {
          updatedRow.netAmunt = updatedRow.ValueAfterDis - updatedRow.TTS
          updatedRow.NetAmountWithAdvanceTax = updatedRow.AdvanceTax + updatedRow.netAmunt

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
            const totalBox = updatedRow.unit / findProduct.PcsinBox
            console.log(totalBox)
            updatedRow.ValueExclGstperBox = findProduct.TPSale
            updatedRow.TotalValueExclGst = totalBox * findProduct.TPSale
            updatedRow.RPValueExclGst = totalBox * findProduct.RetailPrice

            if (findProduct.SaleTaxBy == 2) {
              console.log("SaleTaxBy 2")
              if (updatedRow.discount == 0) {
                updatedRow.Gst = (updatedRow.TotalValueExclGst / 100 * findProduct.SaleTaxPercent)
              }
              else {
                updatedRow.Gst = ((updatedRow.TotalValueExclGst - updatedRow.discount)) / 100 * findProduct.SaleTaxPercent
              }
            } else {
              console.log("SaleTaxBy 1",)
              updatedRow.Gst = (findProduct.TPSale / 100 * findProduct.SaleTaxPercent * value)
            }

            updatedRow.RPValueInclGST = updatedRow.Gst + updatedRow.RPValueExclGst
            updatedRow.RPValueInclGST.toFixed(2)
            updatedRow.GSTperBox = updatedRow.Gst / totalBox
            updatedRow.GSTperBox.toFixed(2)
            updatedRow.totalBox = totalBox
            updatedRow.GrossAmntinclGst = updatedRow.Gst + updatedRow.TotalValueExclGst
            updatedRow.GrossAmntinclGst.toFixed(2)
            updatedRow.ValueAfterDis = updatedRow.Gst + updatedRow.TotalValueExclGst
            updatedRow.netAmunt = updatedRow.ValueAfterDis - updatedRow.TTS
            updatedRow.NetAmountWithAdvanceTax = updatedRow.AdvanceTax + updatedRow.netAmunt


            updatedRow.RPValuePerBox = updatedRow.RPValueInclGST / totalBox

            const findClient = Client.find((item) => item._id == poClient.value)
            console.log(findClient)
            updatedRow.netAmunt.toFixed(4)

            if (findClient.AdvanceTaxApply == 1) {
              if (findClient.Filler == 2) {
                updatedRow.AdvanceTax = updatedRow.netAmunt / 100 * 0.25

              } else {
                updatedRow.AdvanceTax = updatedRow.netAmunt / 100 * 0.05

              }
            }
            updatedRow.AdvanceTax.toFixed(4)
            console.log(updatedRow.netAmunt, "updatedRow.netAmunt")
            updatedRow.NetAmountWithAdvanceTax = updatedRow.AdvanceTax + updatedRow.netAmunt
          }

        }
        return updatedRow;
      }
      return row;
    }));
  };
  const totalDiscount = tableData.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0);
  const TotalValueExclGst = tableData.reduce((sum, row) => sum + (parseFloat(row.TotalValueExclGst) || 0), 0);
  const TotalGst = tableData.reduce((sum, row) => sum + (parseFloat(row.Gst) || 0), 0);
  const totalBox = tableData.reduce((sum, row) => sum + (parseInt(row.box) || 0), 0);
  const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);
  const totalUnit = tableData.reduce((sum, row) => sum + (parseInt(row.unit) || 0), 0);
  const totalnetAmunt = tableData.reduce((sum, row) => sum + (parseFloat(row.netAmunt) || 0), 0);
  const totalAdvanceTax = tableData.reduce((sum, row) => sum + (parseFloat(row.AdvanceTax) || 0), 0);
  const TotalAmountWithAdvanceTax = tableData.reduce((sum, row) => sum + (parseFloat(row.NetAmountWithAdvanceTax) || 0), 0);

  const onSubmit = async (data) => {
    data.Client = poClient.value
    data.SaleInvoiceData = tableData
    data.Store = salesStore.value,
      data.Location = salesLoction.value
    data.RemainingAmount = TotalAmountWithAdvanceTax
    data.TotalAmount = TotalAmountWithAdvanceTax
    console.log(data)
    try {
      const res = await createDataFunction('/SaleInvoice', data)
      console.log(res)
      toast.success("Sales Invoice Add")
      setTimeout(() => {

        navigate('/SalesInvoice')
      }, 2000)
    }
    catch (err) {
      const error = err.response.data.errors
      console.log(error)
      if (error) {

        try {
          const notAvalible = `this product not avalibale ${Products.find((item) => item._id == error[0]).ProductName} on your location`
          toast.error(notAvalible)
        }
        catch {
          console.log(err)
          const notAvalible = `Qty of ${Products.find((item) => item._id == error[0].product).ProductName} Avalibale Qty ${error[0].qty}  you need ${error[0].required} Boxes`
          toast.error(notAvalible)
        }
      }
    }



  }


  const loadclients = async (inputValue) => {
    if (!inputValue) return [];

    const filtered = AllClient
      .filter((item) =>
        item.CutomerName.toLowerCase().includes(inputValue.toLowerCase()) || item.code.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 50);

    return filtered.map((item) => ({
      label: `${item.CutomerName} ${item.code}`,
      value: item._id
    }));
  }

  const startingClient = AllClient.slice(0, 50).map((item) => ({
    label: `${item.CutomerName} ${item.code}`,
    value: item._id
  }));;

  const loadInvoiceOptions = async (inputValue) => {
    console.log(poClient)
    const selectedClient = Client.find((item) => item._id == poClient.value).Vendor
    console.log(selectedClient)
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
    console.log(product)
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
  const defultStore = Store.find((item) => item._id == loginVendor.Store[0])
  const selectedStore = {
    label: defultStore?.StoreName,
    value: defultStore?._id
  }

  const setDrp = (value) => {
    setSalesLoction(value)
    const values = value.value;
    setSelectedLocation(values);
    setSalesStore([]);
    const userStore = loginVendor.Store
    const updatedStoreDrp = Store?.filter(item => values.includes(item.Location))
      .filter(store => userStore.includes(store._id))
      .map((st) => ({
        label: st.StoreName,
        value: st._id
      }))

    setStoreDrp(updatedStoreDrp);
    console.log(storeDrp)
  }

  return (
    <div className="p-4  ">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Create Sales Invoice</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Sale Date</label>
            <input
              type="date"
              {...register("SaleInvoiceDate", { required: true })}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Client</label>
            <AsyncSelect
              onChange={(vals) => setPoClient(vals)}
              loadOptions={loadclients}
              defaultOptions={startingClient}
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
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Invoice No</label>
            <input
              type="text"
              disabled
              defaultValue={''}
              {...register("salesInvoice")}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
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
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Location</label>
            <Select onChange={(v) => setDrp(v)} options={Location} defaultValue={Location[0]} isDisabled={loginVendor.userType == 1 ? true : false} />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Store</label>
            <Select onChange={(v) => setSalesStore(v)} value={salesStore} options={storeDrp} isDisabled={loginVendor.userType == 1 ? true : false} />
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
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
                    <AsyncSelect
                      menuPortalTarget={document.body}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      cacheOptions
                      loadOptions={loadInvoiceOptions}
                        value={row.product ? {
                          value: `${row.product} ${console.log(row)}`,
                          label: `${Products.find((p) => p._id === row.product)?.mastercode} ${Products.find((p) => p._id === row.product)?.ProductName}`
                        } : null}
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'product', selectedOption || '')
                      }
                      className="text-sm"
                      classNamePrefix="select"
                      placeholder="Select Product..."
                      isSearchable
                      isClearable
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
                  <td className="border p-2 hidden lg:table-cell">{row.Gst || 0.00}</td>
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
                  <td className="border p-2 hidden lg:table-cell">{Number(row?.AdvanceTax)?.toFixed(2) || 0.00}</td>
                  <td className="border p-2">{row?.discount || 0}</td>
                  <td className="border p-2 hidden xl:table-cell">{Number(row?.ValueAfterDis)?.toFixed(2) || 0.00}</td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.TTS || 0}
                      onChange={(e) => handleCellChange(row.id, 'TTS', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">{Number(row?.netAmunt)?.toFixed(2) || 0.00}</td>
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
            Create Sale Invoice
          </button>
        </div>
      </form>
    </div>
  )
}

export default SalesInvoiceAdd