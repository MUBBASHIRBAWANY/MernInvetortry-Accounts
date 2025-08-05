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

    const handleCellChange = (id, field, feildvalue) => {
        let value = feildvalue.value

        setTableData(tableData.map(row => {
            if (row.id === id) {
                const updatedRow = { ...row, [field]: value };
                if (field == "diBspass") {
                    updatedRow.diBspass = feildvalue
                }
                if (field == "RToffer") {
                    updatedRow.RToffer = feildvalue
                }
                if (field == "WToffer") {
                    updatedRow.WToffer = feildvalue
                }
                if (field == "RpDrive") {
                    updatedRow.RpDrive = feildvalue
                }
                if (field == "WHOLESALEDEAL") {
                    updatedRow.WHOLESALEDEAL = feildvalue
                }

                if (field == "diBspass" || field == "RToffer" || field == "WToffer" || field == "RpDrive" || field == "WHOLESALEDEAL") {
                    updatedRow.discount = parseInt(updatedRow.diBspass) + parseInt(updatedRow.RToffer) + parseInt(updatedRow.WToffer) + parseInt(updatedRow.RpDrive) + parseInt(updatedRow.WHOLESALEDEAL)
                    updatedRow.ValueAfterDis = updatedRow.Gst + updatedRow.TotalValueExclGst - updatedRow.discount + updatedRow.AdvanceTax  //- updatedRow.discount + updatedRow.AdvanceTax
                    updatedRow.netAmunt = updatedRow.ValueAfterDis - updatedRow.TTS
                }
                if (field == "TTS") {
                    updatedRow.TTS = feildvalue
                    updatedRow.netAmunt = updatedRow.ValueAfterDis - updatedRow.TTS
                }
                // Reset fields when product changes
                if (field == "product") {
                    const findProduct = Products.find((item) => item._id == value);
                    console.log(findProduct)
                    if (findProduct) {
                        updatedRow.rate = findProduct.TPSale; // Set default rate to product's TPSale
                    }

                    // Reset calculation fields
                    updatedRow.AdvanceTax = 0;
                    updatedRow.TotalValueExclGst = '';
                    updatedRow.RPValueExclGst = '';
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

                // Handle rate changes
                if (field === "rate") {
                    updatedRow.rate = parseFloat(value) || 0;
                }

                // Reset calculation if product is cleared
                if (updatedRow.product === undefined) {
                    console.log("first")
                    updatedRow.netAmunt = 0;
                    updatedRow.AdvanceTax = 0;
                    updatedRow.discount = 0;
                    updatedRow.ValueExclGstperBox = "";
                    updatedRow.TotalValueExclGst = '';
                    updatedRow.RPValueExclGst = '';
                    updatedRow.GstonRpvalue = 0;
                    updatedRow.box = "";
                    updatedRow.unit = "";
                    updatedRow.carton = '';
                    updatedRow.RPValueInclGST = 0;
                    updatedRow.GSTperBox = 0;
                    updatedRow.GrossAmntinclGst = 0;
                    updatedRow.AdvanceTax = 0;
                    updatedRow.diBspass = 0;
                    updatedRow.rate = 0;
                    updatedRow.RToffer = 0;
                    updatedRow.WToffer = 0;
                    updatedRow.RpDrive = 0;
                    updatedRow.WHOLESALEDEAL = 0;
                    updatedRow.TTS = 0;
                    updatedRow.Gst = 0;
                    updatedRow.ValueAfterDis = 0;
                }

                const findProduct = Products.find((item) => item._id === updatedRow.product);

                // Handle quantity changes (carton/box)
                if (field === "carton" || field === "box" || field === "rate") {
                    if (field === "carton") {
                        updatedRow.carton = feildvalue || 0;
                    } else if (field === "box") {
                        updatedRow.box = feildvalue || 0;
                    } else if (field === "rate") {
                        updatedRow.rate = feildvalue || 0;
                    }

                    if (findProduct) {
                        const BoxinCarton = parseInt(findProduct.BoxinCarton);
                        const PcsinBox = parseInt(findProduct.PcsinBox);
                        const Allunit = BoxinCarton * PcsinBox;
                        const box = parseInt(updatedRow.box);
                        const carton = parseInt(updatedRow.carton);

                        console.log(updatedRow.carton)
                        if (box === 0) {
                            updatedRow.unit = Allunit * carton;
                        } else if (carton === 0) {
                            updatedRow.unit = PcsinBox * box;
                            console.log(updatedRow.unit)
                        } else {
                            const totalbox = box * findProduct.PcsinBox;
                            updatedRow.unit = Allunit * carton + totalbox;
                        }

                        const totalBox = updatedRow.unit / findProduct.PcsinBox;

                        // Use editable rate for calculations
                        updatedRow.ValueExclGstperBox = updatedRow.rate || 0;
                        updatedRow.TotalValueExclGst = totalBox * updatedRow.rate;
                        updatedRow.RPValueExclGst = totalBox * findProduct.RetailPrice;
                        findProduct.SaleTaxBy === "1"
                            ? updatedRow.Gst = (updatedRow.TotalValueExclGst / 100) * parseInt(findProduct.SaleTaxPercent)
                            : updatedRow.Gst = (updatedRow.RPValueExclGst / 100) * parseInt(findProduct.SaleTaxPercent);

                        updatedRow.RPValueInclGST = updatedRow.Gst + updatedRow.RPValueExclGst;
                        updatedRow.GSTperBox = updatedRow.Gst / totalBox;
                        updatedRow.totalBox = totalBox;
                        updatedRow.GrossAmntinclGst = updatedRow.Gst + updatedRow.TotalValueExclGst;
                        updatedRow.ValueAfterDis = updatedRow.Gst + updatedRow.TotalValueExclGst - updatedRow.discount + updatedRow.AdvanceTax;
                        updatedRow.netAmunt = updatedRow.ValueAfterDis - updatedRow.TTS;

                        // Handle client-specific advance tax
                        const findClient = Client.find((item) => item._id === poClient?.value);
                        if (findClient && findClient.AdvanceTaxApply == 1) {
                            console.log(findClient && findClient.AdvanceTaxApply)

                            updatedRow.AdvanceTax = findClient.Filler === 2
                                ? updatedRow.GrossAmntinclGst / 100 * 0.25
                                : updatedRow.GrossAmntinclGst / 100 * 0.05;
                        }


                        updatedRow.AdvanceTax = parseFloat(updatedRow.AdvanceTax?.toFixed(2)) || 0;
                        updatedRow.netAmunt = parseFloat(updatedRow.netAmunt?.toFixed(2)) || 0;
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
    const clients = AllClient.filter(value =>
        value.Vendor.some(v => v == loginVendor.Vendor[0])
    ).map((ven) => ven.Vendor).flat();

    const startingvendor = Vendor.filter((item) => clients.includes(item._id))
        .map((item1) => item1.code)

    const startingProduct = Products.filter(
        product => product.mastercode.startsWith(startingvendor[0])
    ).map((p) => {
        return ({
            label: `${p.ProductName} ${p.mastercode}`,
            value: p._id
        })
    }).slice(0, 50)



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
                            {...register("SalesInvoiceReturnDate", { required: true })}
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
                        <Select onChange={(v) => setSalesStore(v)} options={storeDrp} value={loginVendor.userType == 1 ? selectedStore : null} isDisabled={loginVendor.userType == 1 ? true : false} />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Condition</label>
                        <select {...register("Damage")} className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'>
                            <option value="Fresh"> Fresh</option>
                            <option value="Damage"> Damage</option>

                        </select>
                        {/**/}
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
                                        <AsyncSelect
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                            cacheOptions
                                            defaultOptions={startingProduct}
                                            loadOptions={loadInvoiceOptions}
                                            value={row.product ? {
                                                value: `${row.product} }`,
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