import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import { generateNextCode, generateNextCodeForOrder } from '../Global/GenrateCode';



const SaleOrderAdd = () => {
    const navigate = useNavigate();
    const [poClient, setPoClient] = useState(null);
    const [filterClinet, setFilterClinet] = useState([])
    const Client = useSelector((state) => state.Client.client)
    const Products = useSelector((state) => state.Product.product);
    const Vendor = useSelector((state) => state.Vendor.state)
    const location = useSelector((state) => state.Location.Location)
    const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
    const Store = useSelector((state) => state.Store.Store)
    const [AllProduct, SetAllProduct] = useState([])
    const [tableData, setTableData] = useState([]);
    const [OderBooker, setOderBooker] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const [salesLoction, setSalesLoction] = useState([])
    const [salesStore, setSalesStore] = useState([])
    const [storeDrp, setStoreDrp] = useState([])
    const OrderBooker = useSelector((state) => state.OrderBooker.OrderBooker)

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
            carton: 0,
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
                        updatedRow.rate = 0
                        updatedRow.carton = 0
                    }
                }
                if (updatedRow.product == "") {
                    updatedRow.Amount = 0
                    updatedRow.carton = 0
                }
                const findProduct = Products.find((item) => item._id === updatedRow.product);
                if (field == "product") {
                    updatedRow.unit == 0
                }
                updatedRow.Remaingcarton = updatedRow.carton
                updatedRow.Amount = updatedRow.carton * updatedRow.rate
                return updatedRow;
            }
            return row;
        }));
    };
    const TotalAmount = tableData.reduce((sum, row) => sum + (parseFloat(row.Amount) || 0), 0);
    const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);

    const onSubmit = async (data) => {
        data.Customer = poClient.value
        data.SaleOrderData = tableData
        data.Store = salesStore.value,
        data.Location = salesLoction.value
        data.OrderBookerName = OderBooker.label,
        data.OrderBookerId = OderBooker.value
        data.Status = "false"


        console.log(data)
        try {
            const lastCode = await getDataFundtion("/SaleOrder/lastcode")
            console.log(lastCode.data)

            lastCode.data == null ? data.SaleOrderNumber = "000001" : data.SaleOrderNumber = generateNextCodeForOrder(lastCode.data.SaleOrderNumber)

            const res = await createDataFunction('/SaleOrder', data)
            console.log(res)
            toast.success("Sales Invoice Add")
            setTimeout(() => {

                navigate('/SaleOrder')
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
    const statrtingProduct = Products.map((item) => ({
        value: item._id,
        label: item.ProductName
    }))


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

    const startingClient = filterClinet.slice(0, 50).map((item) => ({
        label: `${item.CutomerName} ${item.code}`,
        value: item._id
    }));;

    const loadInvoiceOptions = async (inputValue) => {
        console.log(poClient)

        const product = Products.map((p) => ({
            label: `${p.ProductName}`,
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
        value: defultStore?._id,

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

    const setClient = (value) => {
        setOderBooker(value)
        const RegClint = Client.filter((item) => item.Region === value.Region)

        console.log(RegClint)
        setFilterClinet(RegClint)
    }

    const OrderBookerDrp = OrderBooker.map((item) => ({
        value: item._id,
        label: item.OrderBookerName,
        Region: item.Region
    }))

    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Create Sales Order</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Sale Date</label>
                        <input
                            type="date"
                            {...register("SaleOrderDate", { required: true })}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Order Booker</label>
                        <Select  isDisabled={tableData.length === 0 ? false : true} onChange={(v) => setClient(v)} options={OrderBookerDrp} />
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
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Location</label>
                        <Select onChange={(v) => setDrp(v)} options={Location} />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Store</label>
                        <Select onChange={(v) => setSalesStore(v)} value={salesStore} options={storeDrp} />
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
                                <th className="border p-2 hidden lg:table-cell">Rate</th>
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
                                            defaultOptions={statrtingProduct}
                                            loadOptions={loadInvoiceOptions}
                                            value={row.product ? {
                                                value: `${row.product} ${console.log(row)}`,
                                                label: `${Products.find((p) => p._id === row.product)?.ProductName}`
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
                                            value={row.rate}
                                            onChange={(e) => handleCellChange(row.id, 'rate', e.target.value)}
                                            className="w-full p-1 text-xs md:text-sm border rounded"
                                        />
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
                                    <td className="border p-2 hidden lg:table-cell">{TotalAmount?.toFixed(2)}</td>
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
                        Create Sale Order
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SaleOrderAdd