import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { toast, ToastContainer } from 'react-toastify'
import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import { validateArray, validateSales, validateSalesData } from '../Global/CheckUndefind';
import { createDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate, useParams } from 'react-router-dom';


const TransferOutEdit = () => {
    const Store = useSelector((state) => state.Store.Store)
    const Location = useSelector((state) => state.Location.Location)
    const Products = useSelector((state) => state.Product.product);
    const TotalProducts = useSelector((state) => state.TotalProducts.TotalProducts);
    const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
    const TransferOut = useSelector((state) => state.TransferOut.TransferOut)
    const Vendor = useSelector((state) => state.Vendor.state)
    const [productDrp, setProductDrp] = useState([])
    const [filterProduct, setFilterProduct] = useState([])
    const [locationFrmDrp, setLocationFrmDrp] = useState([])
    const [storeFrmDrp, setstoreFrmDrp] = useState([])
    const [locationToDrp, setLocationToDrp] = useState([])
    const [storeToDrp, setstoreToDrp] = useState([])
    const [selectedStoreFrom, setSelectedStoreFrom] = useState(null)
    const [selectedStoreTo, setSelectedStoreTo] = useState(null)
    const [selectedLocationFrm, setSelectedLocationFrm] = useState(null)
    const [selectedLocationTo, setSelectedLocationTo] = useState(null)
    const [trasnferOut, setTrasnferOut] = useState('');
    const [tableData, setTableData] = useState([])

    const { register, handleSubmit, reset,formState: { errors } } = useForm();
    const { id } = useParams();
    const addNewRow = () => {
        setTableData([...tableData, {
            id: Date.now(),
            product: '',
            box: 0,
            carton: 0,
            value: 0
        }]);
    };

    const navigate = useNavigate()

    const onSubmit = async (data) => {
        data.LocationFrom = loginVendor.userType == 1 ? loginVendor.Location[0] : selectedLocationFrm.value
        data.StoreFrom = loginVendor.userType == 1 ? loginVendor.Store[0] : selectedStoreFrom.value
        data.LocationTo =  selectedLocationTo?.value
        data.StoreTo =  selectedStoreTo.value
        data.TransferData = tableData
        console.log(data)
        try {
            const rus = validateSales(data.TransferData)
            if (rus.length != 0) {
                console.log("first")
                return toast.error("Some Thing Went Wrong")
            }
            else {
                const res = await updateDataFunction(`/TransferOut/UpdateInventoryTransferOut/${id}`, data)
                console.log(res)
                navigate(`/TransferOutList`)
            }
        } catch (err) {
            console.log(err)
        }
    }

    const loadLocationFrom = () => {
        if (!inputValue) return [];

        const filtered = Location
            .filter((item) =>
                item.LocationName.toLowerCase().includes(inputValue.toLowerCase()) || item.Location.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50);

        return filtered.map((item) => ({
            label: `${item.LocationName} ${item.code}`,
            value: item._id
        }));
    }

    const LocationFrom = Location.filter(item => loginVendor.Location.includes(item._id))
        .map((item) => ({
            label: item.LocationName,
            value: item._id
        }))

    const setDrp = (value) => {

        setSelectedLocationFrm(value)
        const values = value.value;
        setstoreFrmDrp([]);
        const userStore = loginVendor.Store
        const updatedStoreDrp = Store?.filter(item => values.includes(item.Location))
            .filter(store => userStore.includes(store._id))
            .map((st) => ({
                label: st.StoreName,
                value: st._id
            }))

        setstoreFrmDrp(updatedStoreDrp);

    }
    const setDrp2 = (value) => {
        console.log(value)
        if (!value.value) {
            setSelectedLocationTo({ label: Location.find((item) => item._id == value)?.LocationName, value: value })
        }
        else {
            setSelectedLocationTo(value)
        }
        const values = Array.isArray(value?.value)
            ? value.value
            : [value?.value || value];

        setstoreToDrp([]);
        if (value.value) {
            console.log("first")
            const updatedStoreDrp = Store?.filter(item => values.includes(item.Location))
                .filter(store => !selectedStoreFrom?.value?.includes(store._id))
                .map((st) => ({
                    label: st.StoreName,
                    value: st._id
                }));
                setstoreToDrp(updatedStoreDrp);
        }
        else {
            console.log(TransferOut[0].LocationFrom)
            const updatedStoreDrp = Store?.filter(item => TransferOut[0].LocationFrom.includes(item.Location))
                 .filter(store => !TransferOut[0].StoreFrom?.includes(store._id))
                .map((st) => ({
                    label: st.StoreName,
                    value: st._id
                }));
                setstoreToDrp(updatedStoreDrp);
                console.log(updatedStoreDrp)
            setstoreToDrp(updatedStoreDrp);
        }
    };


    const getData = async () => {
        const TransferOutData = TransferOut.find((item) => item._id == id)
        setTrasnferOut(TransferOutData)
            if (TransferOutData) {
      reset({
        TransferOutDate: TransferOutData.TransferOutDate,
        SalesFlowRef: TransferOutData.SalesFlowRef,
      })
    }
        console.log(TransferOutData.TransferData)
        setTableData(TransferOutData.TransferData)
        setSelectedLocationFrm({ label: Location.find((item) => item._id == TransferOutData.LocationFrom).LocationName, value: TransferOutData.LocationFrom })
        setSelectedLocationTo({ label: Location.find((item) => item._id == TransferOutData.LocationTo).LocationName, value: TransferOutData.LocationTo })
        setSelectedStoreFrom({ label: Store.find((item) => item._id == TransferOutData.StoreFrom).StoreName, value: TransferOutData.StoreFrom })
        setSelectedStoreTo({ label: Store.find((item) => item._id == TransferOutData.StoreTo).StoreName, value: TransferOutData.StoreTo })
        if (loginVendor.userType == 1) {
            const arrProduct = Products.length == 0 ? await getDataFundtion('/product') : Products
            Products.length == 0 ? dispatch(fetchproduct(arrProduct?.data)) : null
            const vendor = Vendor.find((item) => item._id == loginVendor.Vendor[0])?.code
            const VendorProduct = Products.length == 0 ? arrProduct.data.filter((item) => item.mastercode.slice(0, 2) == vendor) : Products.filter((item) => item.mastercode.slice(0, 2) == vendor)
            setFilterProduct(VendorProduct)
        }
        else {
            const Allvendor = Vendor.filter(value => loginVendor.Vendor.includes(value._id));
            const VenCode = Allvendor.map((item) => item.code)

            const allProduct = Products.filter(item => VenCode.includes(item.mastercode.slice(0, 2)))
            setFilterProduct(allProduct)
        }
        setDrp2(TransferOutData.LocationTo)


    }

    useEffect(() => {
        getData()
    }, [])
    const loadProductOptions = (inputValue) => {
        if (!inputValue) return Promise.resolve([]);

        const filtered = filterProduct
            .filter(item =>
                item.ProductName.toLowerCase().includes(inputValue.toLowerCase()) ||
                item.mastercode.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50)
            .map(item => ({
                label: `${item.ProductName} ${item.mastercode}`,
                value: item._id
            }));
        return Promise.resolve(filtered);
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
                        updatedRow.box = 0
                        updatedRow.unit = 0
                        updatedRow.carton = 0
                        updatedRow.Rate = 0
                        updatedRow.GrossAmount = ""
                    }
                }
                if (updatedRow.product == "") {
                    updatedRow.box = ""
                    updatedRow.unit = ""
                    updatedRow.carton = ''
                    updatedRow.Rate = 0
                    updatedRow.GrossAmount = 0
                }

                const findProduct = Products.find((item) => item._id === updatedRow.product);
                updatedRow.Rate = parseFloat(TotalProducts.find((item) => item.ProductName === updatedRow.product && item.Location == selectedLocationFrm.value && item.Store == selectedStoreFrom.value)?.AvgRate).toFixed(4);

                if (field == "product") {
                    updatedRow.unit == 0
                }
                    if(field == "Reason"){
                    updatedRow.Reason = value
                }
                if (field == "discount") {
                    updatedRow.ValueAfterDiscout = updatedRow.GrossAmount - updatedRow.discount

                    updatedRow.ValuewithGst = updatedRow.Gst + updatedRow.ValueAfterDiscout
                    updatedRow.netAmunt = updatedRow.ValuewithGst - updatedRow.AfterTaxdiscount
                }
                if (field == "AfterTaxdiscount") {

                    updatedRow.netAmunt = updatedRow.netAmunt - updatedRow.AfterTaxdiscount
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
                        updatedRow.totalBox = totalBox
                        updatedRow.GrossAmount = (totalBox * updatedRow.Rate)
                    }

                }
                return updatedRow;
            }
            return row;
        }));
    };


    return (
        <div className="p-4  ">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Create TransferOut</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Transfer Date</label>
                        <input
                            type="date"
                            defaultValue={trasnferOut.TransferOutDate }
                            {...register("TransferOutDate", { required: true })}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Location From</label>
                        {loginVendor.userType == 1 ? <input
                            type="text"
                            disabled
                            defaultValue={Location.find((item) => item._id == loginVendor.Location[0]).LocationName}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
                        /> :
                            <AsyncSelect
                                onChange={(vals) => setDrp(vals)}
                                loadOptions={loadLocationFrom}
                                defaultOptions={LocationFrom}
                                value={selectedLocationFrm}
                                className="basic-single text-sm"
                                classNamePrefix="select"
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

                        }
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">StoreFrom</label>
                        {loginVendor.userType == 1 ? <input
                            type="text"
                            disabled
                            defaultValue={Store.find((item) => item._id == loginVendor.Store).StoreName}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
                        /> :
                            <Select onChange={(v) => setSelectedStoreFrom(v)} options={storeFrmDrp} value={selectedStoreFrom} />

                        }
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Location To</label>
                        <AsyncSelect
                            onChange={(vals) => setDrp2(vals)}
                            loadOptions={loadLocationFrom}
                            defaultOptions={selectedLocationFrm ? LocationFrom : null}
                            value={selectedLocationTo}
                            className="basic-single text-sm"
                            classNamePrefix="select"
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
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Store To</label>
                        <Select onChange={(v) => setSelectedStoreTo(v)} options={selectedStoreFrom ? storeToDrp : null} value={selectedStoreTo} />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Sales Flow Ref</label>
                        <input
                            type="text"
                            defaultValue={trasnferOut.SalesFlowRef}
                            {...register("SalesFlowRef")}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Transfer No</label>
                        <input
                            type="text"
                            disabled
                            defaultValue={trasnferOut.TransferCode || ''}
                            {...register("salesInvoice")}
                            className="w-full px-3 py-2 text-sm md:text-base border rounded-lg bg-gray-100"
                        />
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
                                <th className="border p-2">Rate</th>
                                <th className="border p-2 hidden lg:table-cell">Value Excl Gst</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50">
                                    <td className="border p-2">
                                        <AsyncSelect
                                            cacheOptions
                                            defaultOptions
                                            loadOptions={loadProductOptions}
                                            value={row.product ? { label: `${Products.find(item => item._id === row.product)?.ProductName} ${Products.find(item => item._id === row.product)?.mastercode}` || '', value: row.product } : null}
                                            onChange={opt => handleCellChange(row.id, 'product', opt ? opt.value : '')}
                                            isClearable
                                            placeholder="Select Product"
                                            menuPortalTarget={document.body}
                                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
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
                                    <td className="border p-2 hidden lg:table-cell"> {Number.isNaN(Number(row.Rate))
                                        ? "not available in Store"
                                        : row.Rate}
                                    </td>
                                    <td className="border p-2 hidden lg:table-cell">{parseFloat(row.GrossAmount).toFixed(4) || 0.00}</td>
                                    <td className="border p-2">
                                        <input
                                            type="text"
                                            value={row.Reason}
                                            onChange={(e) => handleCellChange(row.id, 'Reason', e.target.value)}
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
                        {/* {tableData.length !== 0 && (
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
                        )} */}
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

export default TransferOutEdit