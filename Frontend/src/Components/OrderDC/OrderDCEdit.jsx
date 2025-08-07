import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion, updateDataFunction } from '../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import { generateNextCode, generateNextCodeForOrder } from '../Global/GenrateCode';



const OrderDCEdit = () => {
  const navigate = useNavigate();
  const {id} = useParams()
  const [poClient, setPoClient] = useState(null);
  const Client = useSelector((state) => state.Client.client)
  const Products = useSelector((state) => state.Product.product);
  const location = useSelector((state) => state.Location.Location)
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
  const Store = useSelector((state) => state.Store.Store)
  const [SaleOrderDrp, SetSaleOrderDrp] = useState([])
  const [tableData, setTableData] = useState([]);
  const [OderBooker, setOderBooker] = useState([])
  const OrderBooker = useSelector((state) => state.OrderBooker.OrderBooker)
  const Order = useSelector((state) => state.SaleOrder.SaleOrder)
  const OrderDc = useSelector((state)=> state.OrderDc.OrderDc)
  const Location = location.filter(item => loginVendor.Location.includes(item._id))




  const { register, handleSubmit, formState: { errors } , reset } = useForm();

  
  const getSaleOrder = (value) => {
    
    setPoClient(value)
    const data = Order.filter((item) => item.Customer == value.value || value)
      ?.map((item) => ({
        value: item.SaleOrderNumber,
        label: item.SaleOrderNumber,
        data: item.SaleOrderData,
        OrderBooker: item.OrderBookerId,
        Location: item.Location,
        Store: item.Store,
        id: Date.now() + Math.random()
      }))
      .filter((val => loginVendor.Store.includes(val.Store)))
    console.log(data)
    SetSaleOrderDrp(data)
  }
  const removeRow = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };


  const getTableData = (value) => {
    const extractdata = SaleOrderDrp.filter((item) => item.value !== value.value)
    SetSaleOrderDrp(extractdata)
    const findDuplicate = tableData.find((item) => item.Order == value.value)
    console.log(findDuplicate)
    if (findDuplicate) {
      return toast.error(`${value.value} saleOrder al ready in table`)
    }
    const output = value.data.map(item => ({
      ...item,
      OrderBooker: value.OrderBooker,
      Order: value.label,
      Location: value.Location,
      Store: value.Store,
    }));

    if (OderBooker.length === 0 || OderBooker == output[0].OrderBooker) {
      setTableData(tableData.concat(output))
      setOderBooker(output[0].OrderBooker)
    }
    else {
      toast.error("this is not blong to same order booker")
    }

  }

const handleCellChange = (id, field, value) => {
  setTableData((prevData) =>
    prevData.map((row) => {
      if (row.id === id) {
        const updatedRow = { ...row, [field]: value };
        updatedRow.product = updatedRow.product.value || updatedRow.product;

        const checking = prevData.find((item) => item.id == id);

        if (field === "product") {
          if (checking.product !== value) {
            updatedRow.rate = 0;
            updatedRow.carton = 0;
            updatedRow.Delivered = 0;
          }

          const findProduct = Products.find((item) => item._id === updatedRow.product);
          if (findProduct) {
            updatedRow.unit = 0; // Or actual value if needed
          }
        }

        // Reset fields if product is empty
        if (!updatedRow.product) {
          updatedRow.Amount = 0;
          updatedRow.carton = 0;
        }

        // If Delivered changed, update Remaingcarton
        if (field === "Delivered") {
         const deliveredValue = parseFloat(value) || 0;
          const cartonValue = parseFloat(updatedRow.carton) || 0;
          updatedRow.Remaingcarton = cartonValue - deliveredValue;
        }

       

        // Only update Amount when carton or rate changes
        updatedRow.Amount = updatedRow.carton * updatedRow.rate;

        return updatedRow;
      }
      return row;
    })
  );
};

  const TotalAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);
  const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);

  const onSubmit = async (data) => {
    const checke = tableData.filter(obj => !obj.hasOwnProperty("Delivered"))
    console.log(checke)
    if(checke.length !== 0 ){
      return toast.error("Please enter Delivered value ")
    }
    data.Customer = poClient.value
    data.DcData = tableData
    data.Location = loginVendor.Location[0]
    data.Store = loginVendor.Store[0]
    data.Status = "false"
    try {
      const res = await updateDataFunction(`/DcOrder/updateSaleOrder/${id}`, data)
      console.log(res)
      toast.success("Sales Order Edit")
      setTimeout(() => {
        navigate('/OrderDCList')
      }, 2000)
    }
    catch (err) {
      console.log(err)
      toast.error("some went gone wrong")
      const error = err.response.data.errors
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

    const filtered = Client
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


const getData = () =>{
const data = OrderDc.find((item)=> item._id === id)
const client = Client.filter((item)=> item._id == data.Customer).map((val)=> ({
  value : val._id,
  label :val.CutomerName
}))
console.log(client)
setTableData(data.DcData)
getSaleOrder(data.Customer)
setPoClient(client)
reset({
  salesInvoice  : data.DcNumber,
  DcDate : data.DcDate,
  Remarks : data.Remarks
})

}
useEffect(()=>{
  getData()
},[])

  return (
    <div className="p-4  ">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Edit Delivery Order</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Sale Date</label>
            <input
              type="date"
              {...register("DcDate", { required: true })}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Client</label>
            <AsyncSelect
              onChange={(vals) => getSaleOrder(vals)}
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
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Dc No</label>
            <input
              type="text"
              disabled
              
              {...register("salesInvoice")}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Select Order</label>
            <Select onChange={(v) => getTableData(v)} options={SaleOrderDrp} />
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Remarks</label>
            <input
              type="text"
              {...register("Remarks")}
              className="w-full py-3 text-sm md:text-base border rounded-lg"
            />
          </div>
        </div>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Product</th>
                <th className="border p-2">CTN</th>
                <th className="border p-2 ">Delivered</th>
                <th className="border p-2 ">Remaining</th>
                <th className="border p-2 hidden md:table-cell">Order Booker</th>
                <th className="border p-2 hidden md:table-cell">Location</th>
                <th className="border p-2 hidden md:table-cell">Store</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {Products.find((item) => item._id === row.product).ProductName}
                  </td>
                  <td className="border p-2">
                    {row.carton}
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.Delivered}
                      onChange={(e) => handleCellChange(row.id, 'Delivered', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    {row.Remaingcarton || 0}
                  </td>
                  <td className="border p-2 hidden md:table-cell">
                    {OrderBooker.find((item) => item._id === row.OrderBooker).OrderBookerName}
                  </td>
                  <td className="border p-2 hidden md:table-cell">
                    {Location.find((item) => item._id === row.Location).LocationName}
                  </td>
                  <td className="border p-2 hidden md:table-cell">
                    {Store.find((item) => item._id === row.Store).StoreName}
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
            {tableData.length !== 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2">Total</td>
                  <td className="border p-2">{totalCarton}</td>
                  <td className="border p-2 hidden lg:table-cell">{ }</td>
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
            Edit Order Dc
          </button>
        </div>
      </form>
    </div>
 )
}

export default OrderDCEdit