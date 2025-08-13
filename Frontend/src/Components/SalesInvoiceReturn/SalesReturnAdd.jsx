import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
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
    const [tableData, setTableData] = useState([]);
    const [lginerStore, setlginerStore] = useState([])
    const [lginerlocation, setlginerlocation] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const [salesLoction, setSalesLoction] = useState([])
    const [salesStore, setSalesStore] = useState([])
    const [storeDrp, setStoreDrp] = useState([])
    const [clientInvoice, setclientInvoice] = useState([])
    const [salesInvoice, setSalesInvoice] = useState([])
    const [invoicedata, setInvoiceData] = useState('')
    const loadPurchseInvoiceOptions = async (inputValue) => {
        if (!inputValue) return [];
        console.log(salesInvoice)
        const filtered = salesInvoice
            .filter((item) =>
                item.SalesInvoice.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results

        console.log(filtered)
        return filtered.map((item) => ({
            value: item.SalesInvoice,
            label: item.SalesInvoice

        })).slice(0, 50);
    };


    const GetSaleinvoice = async (value) => {
        console.log(value)
        setclientInvoice('')
        setPoClient(value)
        const getInvoice = await getDataFundtion(`SaleInvoice/invoiceClient/${value.value}`)
        console.log(getInvoice.data)
        setSalesInvoice(getInvoice.data)

        const data = getInvoice.data.map((item) => ({
            value: item.SalesInvoice,
            label: item.SalesInvoice
        })).slice(0, 50)
        console.log(data)
        setclientInvoice(data)
        console.log(clientInvoice)

    }


    const setData = (val) => {

        const data = salesInvoice.find((item) => item.SalesInvoice == val.value)
        setInvoiceData(data)
        setTableData(data.SalesData)
    }

    const Location = location.filter(item => loginVendor.Location.includes(item._id))
        .map((item) => ({
            label: item.LocationName,
            value: item._id
        }))

    const { register, handleSubmit, formState: { errors }, reset } = useForm();


    const removeRow = (id) => {
        setTableData(tableData.filter(row => row.id !== id));
    };

    const handleCellChange = (id, field, feildvalue) => {
        let value = feildvalue.value || feildvalue

        setTableData(tableData.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field = "return") {
                    if (Number(updatedRow.return) > Number(updatedRow.carton)) {
                        console.log("updatedRow.return")
                        toast.error("Return Qty Should be less then Deilver Qty ")
                        return row
                    }

                }
                if (updatedRow.netAmunt > invoicedata.RemainingAmount) {
                    console.log("updatedRow.return")
                    toast.error("Amount Should be less then Remaing Amount")
                    return row
                }
                if (field = "return") {
                 if (updatedRow.netAmunt > invoicedata.RemainingAmount) {
                    console.log("updatedRow.return")
                    toast.error("Amount Should be less then Remaing Amount")
                    return row
                }

                }
                updatedRow.netAmunt = (Number(updatedRow.Rate) * Number(updatedRow.return)) - (Number(updatedRow.discount || 0))



                return updatedRow;
            }
            return row;
        }));
    };


    const totalDiscount = tableData.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0);
    const totalCarton = tableData.reduce((sum, row) => sum + (parseInt(row.carton) || 0), 0);

    const onSubmit = async (data) => {
        data.Client = poClient.value
        data.SalesReturnData = tableData
        loginVendor.userType == 1 ? data.Store = loginVendor.Store[0] : data.Store = salesStore.value
        loginVendor.userType == 1 ? data.Location = loginVendor.Location[0] : data.Location = salesStore.value
        console.log(data)
        try {
            const res = await createDataFunction('/SalesInvoiceReturn', data)
            console.log(res)
            navigate('/SalesReturnList')
        }
        catch (err) {
            const error = err.response.data.errors
            if (error) {
                console.log(error)
                try {
                    const notAvalible = `this product not avalibale ${Products.find((item) => item._id == error[0]).ProductName} on your location`
                    toast.error(notAvalible)
                }
                catch {
                    const notAvalible = `Qty of ${Products.find((item) => item._id == error[0][0].product).ProductName} Avalibale Qty ${error[0][0].qty}  you need ${error[0][0].Req} Boxes`
                    toast.error(notAvalible)
                }
            }
        }
    }


    useEffect(() => {
        const today = new Date();
        const formatted = today.toISOString().split("T")[0]; // YYYY-MM-DD
        reset({
            SalesInvoiceReturnDate: formatted
        })
    }, [])
    const clients = Client

    const startingvendor = Vendor.filter((item) => clients.includes(item._id))
        .map((item1) => item1.code)




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
    console.log(Client)
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
        <div className=" p-4">
            <ToastContainer />
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Create Sales Return </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Return Date</label>
                        <input
                            type="date"
                            {...register("SalesInvoiceReturnDate", { required: true })}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Client</label>
                        <AsyncSelect
                            onChange={(vals) => GetSaleinvoice(vals)}
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
                        <label className="block text-gray-700 font-semibold mb-2">Select Invoice</label>
                        <AsyncSelect
                            defaultOptions={clientInvoice}
                            loadOptions={loadPurchseInvoiceOptions}
                            isDisabled={tableData.length != 0 ? true : false}
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Select Vendor..."
                            onChange={(val) => {
                                setData(val)
                            }}
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Purchace Return No</label>
                        <input
                            type="text"
                            disabled
                            defaultValue={''}
                            {...register("purchase")}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-100"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Location</label>
                        <input
                            type="text"
                            disabled={true}
                            defaultValue={lginerlocation[0]?.label}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Store</label>
                        <input
                            type="text"
                            disabled={true}
                            value={lginerStore[0]?.label}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                {/* Excel-like Table */}
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-36">Product</th>

                                <th className="border p-2">CTN</th>
                                <th className="border p-2">Return</th>
                                <th className="border p-2">Rate </th>
                                <th className="border p-2"> Discount</th>
                                <th className="border p-2">Gst</th>
                                <th className="border p-2">Net Amount </th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        {Products.find((item) => item._id == row.product)?.ProductName}
                                    </td>
                                    <td className="border p-2">
                                        {row.carton}
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="text"
                                            value={row.return}
                                            onChange={(e) => handleCellChange(row.id, 'return', e.target.value)}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>
                                    <td className="border p-2">
                                        <input
                                            type="text"
                                            value={row.Rate}
                                            onChange={(e) => handleCellChange(row.id, 'Rate', e.target.value)}
                                            className="w-full p-1 border rounded"
                                        />
                                    </td>

                                    <td className="border p-2">
                                        <input
                                            type="number"
                                            value={row.discount}
                                            onChange={(e) => handleCellChange(row.id, 'discount', e.target.value)}
                                            className="w-full p-1 border rounded"
                                        />
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
                            tableData.length != 0 ? <tfoot>
                                <tr className="bg-gray-100 font-semibold">
                                    <td className="border p-2">Total</td>
                                    <td className="border p-2">{totalCarton}</td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                    <td className="border p-2"></td>
                                </tr>
                            </tfoot> : null
                        }
                    </table>
                </div>

                <div className="flex  justify-between">

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

export default SalesInvoiceAdd