import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';

const SalesInvoiceEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams()
  const [poClient, setPoClient] = useState(null);
  const Client = useSelector((state) => state.Client.client)
  const Products = useSelector((state) => state.Product.product);
  const SalesInvoice = useSelector((state) => state.SalesInvoice.SalesInvoice)
  const findInvoice = SalesInvoice.find((item) => item._id == id)
  const location = useSelector((state) => state.Location.Location)
  const Store = useSelector((state) => state.Store.Store)
  const [selectedOrderBooker, SetselectedOrderBooker] = useState([])
  const [selecetLoction, setSelecetLoction] = useState([])
  const [selecetStore, setSelecetStore] = useState([])
  const [DcClient, setDcClient] = useState([])
  const [SaleOrderDc, setSaleOrderDc] = useState([])
  const [SelectedDC, setSelectedDC] = useState([])
  const [lessAccount, setlessAccount] = useState("")
  const [AddAccount, setAddAccount] = useState("")
  const [AddAmount, setAddAmount] = useState(0)
  const [LessAmount, setLessAmount] = useState(0)
  const OrderDc = useSelector((state) => state.OrderDc.OrderDc)
  const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts);

  const filteredAccount = Accounts.filter((item) => item.AccountCode.length > 5)

  const [tableData, setTableData] = useState([]);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const AllProduct = {
    options: Products.map((item) => ({ value: item._id, label: `${item.code} ${item.ProductName}` })),
  };

  const AllClient = {
    options: Client.map((item) => ({ value: item._id, label: item.CutomerName })),
  };
  const loadAccounts = async (inputValue) => {
    if (!inputValue) return [];

    const filtered = filteredAccount
      .filter((item) =>
        item.AccountName.toLowerCase().includes(inputValue.toLowerCase()) || item.AccountCode.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 50);

    return filtered.map((item) => ({
      label: `${item.AccountCode} ${item.AccountName}`,
      value: item._id
    }));
  }

  const startingAccount = filteredAccount.slice(0, 50).map((item) => ({
    label: `${item.AccountCode} ${item.AccountName}`,
    value: item._id
  }));;

  const findClient = Client.find((item) => item._id == findInvoice.Client)
  const defultClient = {
    label: findClient.CutomerName,
    value: findClient._id
  }

  const findLocation = location.find((item) => findInvoice.Location)
  const disableLocation = {
    label: findLocation.LocationName,
    value: findLocation._id
  }
  const findStore = Store.find((item) => findInvoice.Store)
  const disableStore = {
    label: findStore.StoreName,
    value: findStore._id
  }
  useEffect(() => {
    setPoClient(defultClient.value)
    setTableData(findInvoice.SalesData)
    setSelectedDC(findInvoice.DcNumber)
    reset({
      SaleInvoiceDate: findInvoice.SalesInvoiceDate,
      LessAmount: findInvoice.LessAmount,
      AddAmount: findInvoice.AddAmount
    })
    setAddAccount(findInvoice.AddAccount)
    setlessAccount(findInvoice.LessAccount)
    setAddAmount(findInvoice.AddAmount)
    setLessAmount(findInvoice.LessAmount)
  }, [])

  const totalAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.netAmunt) || 0), 0);

  let totalNetAmount = totalAmount + Number(AddAmount) - Number(LessAmount)

  const onSubmit = async (data) => {
    data.SaleInvoiceData = tableData
    data.AddAccount = AddAccount,
    data.LessAccount = lessAccount
    data.RemainingAmount = totalNetAmount,
    data.TotalAmount = totalNetAmount

    console.log(data)
    try {
      const res = await updateDataFunction(`SaleInvoice/UpdateSalesInvoice/${id}`, data)
      console.log(res)
      toast.success("Data Add")
      setTimeout(() => {
        navigate('/SalesInvoice')
      }, 2000)
    }
    catch (err) {
      const error = err.response.data.errors
      if (error) {
        console.log(error)
        try {
          const notAvalible = `this product not avalibale ${Products.find((item) => item._id == error[0]).ProductName}`
          toast.error(notAvalible)
        }
        catch (err) {
          console.log(err)
          const notAvalible = `Qty of ${Products.find((item) => item._id == error[0][0].product).ProductName} Avalibale Qty ${error[0][0].qty}  you need ${error[0][0].Req} Boxes`
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

  const startingClient = Client.slice(0, 50).map((item) => ({
    label: `${item.CutomerName} ${item.code}`,
    value: item._id
  }));;
  const handleCellChange = (id, field, value) => {
    console.log(field)
    setTableData(tableData.map(row => {
      if (row.id === id) {

        const updatedRow = { ...row, [field]: value };
        updatedRow.product = updatedRow.product.value || updatedRow.product
        const checking = tableData.find((item) => item.id == id)

        const findProductGst = Products.find((item) => item._id == updatedRow.product).SaleTaxPercent


        updatedRow.TotalAmount = updatedRow.Rate * updatedRow.carton
        updatedRow.netAmunt = ((updatedRow.TotalAmount / 100 * Number(findProductGst)) + updatedRow.TotalAmount) - (updatedRow.Discount || 0)
        return updatedRow;
      }
      return row;
    }));
  };


  const getDataDc = (value) => {
    setSaleOrderDc([])
    setPoClient(value)
    const getClientDc = OrderDc.filter((item) => item.Customer === value.value)
    const data = getClientDc.map((val) => ({
      value: val.DcNumber,
      label: val.DcNumber,
    }))
    console.log(getClientDc)
    setDcClient(data)
    setSelecetLoction(getClientDc[0].Location)
    setSelecetStore(getClientDc[0].Store)


  }
  const setDrp = (value) => {
    setSaleOrderDc(value)
    const values = value.value;
    const Order = OrderDc.find((val) => val.DcNumber === values)
    console.log(Order.DcData)
    setTableData(Order.DcData)
    SetselectedOrderBooker(Order.DcData[0].OrderBooker)

  }

  return (
    <div className="p-4  ">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Update Sales Invoice</h1>

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
              onChange={(vals) => getDataDc(vals)}
              loadOptions={loadclients}
              defaultOptions={startingClient}
              value={poClient ? {
                label: Client.find((item) => item._id == poClient).CutomerName
              } : null}
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
              value={findInvoice.SalesInvoice}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
            />
          </div>


          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Dc Number</label>
            <Select value={SelectedDC ? {
              label: SelectedDC
            } : null} options={DcClient} isDisabled={tableData.length === 0 ? false : true} />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Store</label>
          </div>
        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2 hidden lg:table-cell">Rate</th>
                <th className="border p-2 hidden xl:table-cell">Total Amount</th>
                <th className="border p-2 hidden xl:table-cell">Discount</th>
                <th className="border p-2 hidden lg:table-cell">GST</th>
                <th className="border p-2">Net Amount</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {Products.find((item) => item._id == row.product).ProductName}
                  </td>
                  <td className="border p-2">
                    {row.carton}
                  </td>

                  <td className="border p-2 hidden lg:table-cell">
                    <input
                      type="number"
                      value={row?.Rate}
                      onChange={(e) => handleCellChange(row.id, 'Rate', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 ">
                    {row.TotalAmount || 0}
                  </td>
                  <td className="border p-2 hidden xl:table-cell">
                    <input
                      type="number"
                      value={row?.Discount || 0}
                      onChange={(e) => handleCellChange(row.id, 'Discount', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2 hidden lg:table-cell">{row.Gst || 0.00}</td>
                  <td className="border p-2 hidden xl:table-cell">
                    {row.netAmunt}
                  </td>
                </tr>
              ))}
            </tbody>
            {tableData.length !== 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">Total</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>

                </tr>
              </tfoot>
            )}
          </table>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">

          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
          >
            Create Sale Invoice
          </button>
        </div>
        <div className='flex justify-end gap-2'>
          <div className="bg-gradient-to-br from-rose-50 to-white min-w-[24vw] p-3 rounded-lg border border-rose-100 shadow space-y-3">

            {/* Net Amount */}
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-rose-600">Net Amount:</label>
              <span className="text-sm font-bold text-rose-600">{totalAmount}</span>
            </div>

            {/* Less Account Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Less Account</span>

              <AsyncSelect
                menuPortalTarget={document.body}
                onChange={(selectedOption) => setlessAccount(selectedOption?.value)}
                loadOptions={loadAccounts}
                value={lessAccount ? {
                  label: `${Accounts.find((item) => item._id == lessAccount).AccountName} ${Accounts.find((item) => item._id == lessAccount).AccountCode}`
                } : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#fff1f2',
                    borderColor: '#fecdd3',
                    minHeight: '32px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#fda4af' }
                  })
                }}
                defaultOptions={startingAccount}
                isClearable={true}
                className="text-xs min-w-[14vw] max-w-[14vw]"
                classNamePrefix="select"
                isSearchable
                placeholder="Select..."
              />

              <span className="text-sm font-medium text-gray-700">Amt</span>
              <input
                type="number"
                {...register("LessAmount")}
                onChange={(e) => setLessAmount(e.target.value)}
                placeholder="0"
                className="w-[6vw] px-2 py-1 text-xs text-right bg-rose-50 border border-rose-200 rounded focus:ring-1 focus:ring-rose-300 focus:border-rose-400 focus:outline-none transition"
              />
            </div>

            {/* Add Account Section */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Add Account</span>

              <AsyncSelect
                menuPortalTarget={document.body}
                onChange={(selectedOption) => setAddAccount(selectedOption?.value)}
                loadOptions={loadAccounts}
                value={AddAccount ? {
                  label: `${Accounts.find((item) => item._id == AddAccount).AccountName} ${Accounts.find((item) => item._id == AddAccount).AccountCode}`
                } : null}
                styles={{
                  menuPortal: base => ({ ...base, zIndex: 9999 }),
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: '#fff1f2',
                    borderColor: '#fecdd3',
                    minHeight: '32px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#fda4af' }
                  })
                }}
                defaultOptions={startingAccount}
                isClearable={true}
                className="text-xs min-w-[14vw]"
                classNamePrefix="select"
                isSearchable
                placeholder="Select..."
              />

              <span className="text-sm font-medium text-gray-700">Amt</span>
              <input
                type="number"
                {...register("AddAmount")}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="0"
                className="w-[6vw] px-2 py-1 text-xs text-right bg-rose-50 border border-rose-200 rounded focus:ring-1 focus:ring-rose-300 focus:border-rose-400 focus:outline-none transition"
              />
            </div>

            {/* Total Net Amount */}
            <div className="pt-2 border-t border-rose-100">
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm font-semibold text-gray-800">Total Net:</span>
                <span className="text-sm font-bold text-rose-600">{totalNetAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SalesInvoiceEdit