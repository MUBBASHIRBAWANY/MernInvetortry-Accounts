import React, { use, useEffect, useMemo, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { createDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import AsyncSelect from 'react-select/async';
import Select from 'react-select'
import * as XLSX from 'xlsx';
import { toast, ToastContainer } from 'react-toastify';
import { set } from 'react-hook-form';
import { useSelector } from 'react-redux';

const InventoryValutionByProduct = () => {
    const [rows, setRows] = useState([])
    const [columns, setColumns] = useState([])
    const [Startdate, setStartDate] = useState()
    const [Enddate, setEndDate] = useState([])
    const [selectedProduct, setselectedProduct] = useState([])
    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(true);
    const [data, setData] = useState([])
    const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
    const [allProduct, setAllProduct] = useState([])
    const [beforeDate, setBeforeDate] = useState('')
    const [slectedStore, setSlectedStore] = useState('')
    const [selectedLocation, setSelectedLocation] = useState('')
    const [Store, setStore] = useState([])
    const [storeforDrp, setStoreForDrp] = useState([])
    const [Location, setLocation] = useState([])
    const [isLoading, setIsLoading] = useState(false);

    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.text("Inventory Valuation Report", 14, 10);
        const visibleColumns = columns.filter(col => !col.hide);
        autoTable(doc, {
            startY: 20,
            head: [visibleColumns.map(col => col.headerName)],
            body: rows.map(row =>
                visibleColumns.map(col => {
                    const val = row[col.field];
                    return typeof val === 'number' ? val : val ?? '';
                })
            ),
            styles: { fontSize: 8 },
        });

        doc.save("Inventory_Valuation_Report.pdf");
    };


    const downloadExcel = () => {
        const exportData = rows.map(row => {
            const formattedRow = {};
            columns.forEach(col => {
                formattedRow[col.headerName] = row[col.field];
            });
            return formattedRow;
        });

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "InventoryReport");

        XLSX.writeFile(workbook, "Inventory_Valuation_Report.xlsx");
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "");
    };

    const reportData = useMemo(() => {
        if (!data || data.length === 0) return [];


        let totalOpeningBox = 0;
        let totalPerBoxCost = 0;
        let totalBalanceCost = 0;
        const openingRecord = data.filter(item => item.hasOwnProperty('opneingQty'));
        const openingPurchase = data.filter(item => item.hasOwnProperty(`totalPurchaseBoxBefore`)) ?? []
        const openingSale = data.filter(item => item.hasOwnProperty(`totalSaleBoxBefore`)) ?? []
        const OpeningfomBox = data.filter(item => item.hasOwnProperty(`BeforefromValue`)) ?? []
        const OpeningRomTo = data.filter(item => item.hasOwnProperty(`BeforeToValue`)) ?? []
        const openingTrnsferOut = data.filter(item => item.hasOwnProperty(`TransferOutBoxesBefore`)) ?? []
        const openingTrnsferIn = data.filter(item => item.hasOwnProperty(`TransferInBoxesBefore`)) ?? []
        const OpeningSalesReturn = data.filter((item) => item.hasOwnProperty(`totalReturnBoxBefore`)) ?? []
        const opneingStockReplace = data.filter((item) => item.hasOwnProperty(`totalBoxesToReplacementBefore`)) ?? []
        const openingPurchaseReturnBox = data.filter((item) => item.hasOwnProperty('totalPurchaseReturnBoxBefore')) ?? []
        const totalOpening = openingRecord.concat(openingPurchase).concat(openingSale).concat(OpeningfomBox).concat(OpeningRomTo).concat(openingTrnsferOut).concat(openingTrnsferIn).concat(OpeningSalesReturn).concat(opneingStockReplace).concat(openingPurchaseReturnBox)
        const sortedbydate = totalOpening.sort((a, b) => {
            if (!a.date && !b.date) return 0;
            if (!a.date) return -1;
            if (!b.date) return 1;
            return new Date(a.date) - new Date(b.date);
        });



        const openingqty = sortedbydate.reduce((acc, obj) => {
            const open = parseFloat(obj.opneingQty) || 0;
            const openValue = parseFloat(obj.opneingQtyValueExclGst) || 0;
            const sale = parseFloat(obj.totalSaleBoxBefore) || 0;
            const purchase = parseFloat(obj.totalPurchaseBoxBefore) || 0;
            const salesReturn = parseFloat(obj.totalReturnBoxBefore) || 0;
            const purchaseReturn = parseFloat(obj.totalPurchaseReturnBoxBefore) || 0;
            const TransferOutBoxesBefore = parseFloat(obj.TransferOutBoxesBefore) || 0;
            const TransferInBoxesBefore = parseFloat(obj.TransferInBoxesBefore) || 0;
            const TransferInValue = parseFloat(obj.TransferInAmountBefore) || 0;
            const purchaseValue = parseFloat(obj.totalPurchaseValueExclGst) || 0;
            const SalesReturnValue = parseFloat(obj.TotalSRValueExclGstBefore) || 0;
            const stockReplacement = parseFloat(obj.totalBoxesToReplacementBefore) || 0;

            // Opening
            if ("opneingQty" in obj) {
                totalOpeningBox += open;
                totalPerBoxCost = openValue;
                totalBalanceCost = totalOpeningBox * totalPerBoxCost;
            }

            // Sale
            if ("totalSaleBoxBefore" in obj) {
                let StoreAllow = loginVendor.Store.find((item) => item == obj.Store)
                if (!StoreAllow) return;
                totalOpeningBox -= sale;
                totalBalanceCost -= sale * totalPerBoxCost;
            }

            if ("totalValueToReplacementBefore" in obj) {
                let StoreAllow = loginVendor.Store.find((item) => item == obj.Store)
                if (!StoreAllow) return;
                totalOpeningBox -= stockReplacement;
                totalBalanceCost -= stockReplacement * totalPerBoxCost;
            }
            // Transfer Out

            if ("TransferOutBoxesBefore" in obj) {
                const StoreAllow = slectedStore.find((item) => item == obj.StoreFrom)
                if (!StoreAllow) return;
                console.log(TransferOutBoxesBefore)
                totalOpeningBox -= TransferOutBoxesBefore;
                totalBalanceCost -= TransferOutBoxesBefore * totalPerBoxCost;
            }
            
            if ("totalPurchaseReturnBoxBefore" in obj) {
                
                console.log(purchaseReturn)
                totalOpeningBox -= purchaseReturn;
                totalBalanceCost -= purchaseReturn * totalPerBoxCost;
            }
            // Purchase
            if ("totalPurchaseBoxBefore" in obj) {
                let StoreAllow = loginVendor.Store.find((item) => item == obj.Store)
                if (!StoreAllow) return;
                totalOpeningBox += purchase;
                totalBalanceCost += purchaseValue;
                totalPerBoxCost = totalOpeningBox > 0 ? totalBalanceCost / totalOpeningBox : 0;
            }
            if ("totalReturnBoxBefore" in obj) {
                let StoreAllow = loginVendor.Store.find((item) => item == obj.Store)
                if (!StoreAllow) return;
                totalOpeningBox += salesReturn;
                totalBalanceCost += SalesReturnValue;
                totalPerBoxCost = totalOpeningBox > 0 ? totalBalanceCost / totalOpeningBox : 0;
            }


            // Transfer In

            if ("TransferInBoxesBefore" in obj) {
                const StoreAllow = slectedStore.find((item) => item == obj.StoreTo)
                if (!StoreAllow) return;

                totalOpeningBox += TransferInBoxesBefore;
                totalBalanceCost += TransferInValue;
                totalPerBoxCost = totalOpeningBox > 0 ? totalBalanceCost / totalOpeningBox : 0;
            }




            return acc + (open + purchase + salesReturn + TransferInBoxesBefore) - (sale + TransferOutBoxesBefore + stockReplacement);

        }, 0);

        if (!openingRecord) return [];
        // Filter and sort transactions
        const transactions = data
            .filter(item => item.type == 'Purchase' || item.type == 'Issue' || item.type == `TransferIn` || item.type == `TransferOut` || item.type == "Return" || item.type == "StockReplacement" || item.type == "PurchaseReturn")
            .sort((a, b) => new Date(a.date) - new Date(b.date));


        const rows = [];

        // Handle opening date safely
        let openingDate = "Opening";
        if (transactions.length > 0 && transactions[0].date) {
            try {
                const currentDate = new Date(transactions[0].date);
                currentDate.setDate(currentDate.getDate() - 1);
                openingDate = currentDate.toISOString().split('T')[0];
            } catch (e) {
                console.error("Invalid date format", e);
            }
        }

        // Calculate opening values
        // console.log(openingRecord)
        const openingAvgCost = openingRecord.opneingQtyValueInclGst || 0;
        let currentBalanceQty = totalOpeningBox;
        let currentBalanceCost = totalOpeningBox * totalPerBoxCost;
        let currentperBox = openingAvgCost
        rows.push({
            id: 0,
            date: formatDate(beforeDate),
            type: 'Opening',
            quantity: totalOpeningBox,
            perBoxCost: parseFloat(totalPerBoxCost).toFixed(5),
            totalCost: (parseFloat(totalPerBoxCost) * totalOpeningBox).toFixed(5),
            balanceQty: totalOpeningBox,
            balanceCost: (parseFloat(totalPerBoxCost) * totalOpeningBox).toFixed(5),
            avgCostPerBox: parseFloat(totalPerBoxCost).toFixed(5),
        });
        currentBalanceQty = totalOpeningBox;
        currentBalanceCost = totalOpeningBox * totalPerBoxCost;
        currentperBox = parseFloat(totalPerBoxCost).toFixed(5)

        transactions.forEach((transaction, index) => {
            const productName = allProduct.find(item => item._id === selectedProduct)?.ProductName;

            if (transaction.type === "Purchase") {
                const qty = transaction.totalPurchaseBox;
                const cost = parseFloat(transaction.totalPurchaseValueExclGst);
                const perBoxCost = (cost / qty).toFixed(4);

                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: productName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `Pr${transaction.invoice}`,
                    type: "Purchase",
                    quantity: qty,
                    perBoxCost,
                    totalCost: cost.toFixed(5),
                    balanceQty: currentBalanceQty += qty,
                    balanceCost: (currentBalanceCost + cost).toFixed(5),
                    avgCostPerBox: ((currentBalanceCost + cost) / (currentBalanceQty)).toFixed(5),
                    Store: storeforDrp.find((item) => item._id == transaction.Store)?.StoreName,
                    location: Location.find((item) => item.value == transaction.LocationFrom)?.label

                });


                currentBalanceCost += cost;
                currentperBox = (currentBalanceCost / currentBalanceQty).toFixed(5);
            }

            else if (transaction.type === "Issue") {
                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: allProduct.find((item1) => item1._id == selectedProduct)?.ProductName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `Sl${transaction.invoice}`,
                    type: transaction.type,
                    quantity: parseInt(transaction.totalSaleBox),
                    totalCost: ((transaction.totalSaleBox) * (currentBalanceCost / currentBalanceQty)).toFixed(5),
                    perBoxCost: currentperBox,
                    balanceQty: currentBalanceQty - transaction.totalSaleBox,
                    balanceCost: parseFloat((currentBalanceQty - transaction.totalSaleBox) * currentperBox).toFixed(5),
                    avgCostPerBox: currentperBox,
                    Store: storeforDrp.find((item) => item._id == transaction.Store)?.StoreName,
                    location: Location.find((item) => item.value == transaction.LocationFrom)?.label

                });
                currentBalanceQty = currentBalanceQty - transaction.totalSaleBox;
                currentBalanceCost -= parseFloat((transaction.totalSaleBox * currentperBox).toFixed(5));
            }

            else if (transaction.type === "StockReplacement") {
                console.log(transaction.type)
                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: allProduct.find((item1) => item1._id == selectedProduct)?.ProductName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `StockRep${transaction.invoice}`,
                    type: transaction.type,
                    quantity: parseInt(transaction.totalBoxesReplacementTo),
                    totalCost: ((transaction.totalBoxesReplacementTo) * (currentBalanceCost / currentBalanceQty)).toFixed(5),
                    perBoxCost: currentperBox,
                    balanceQty: currentBalanceQty - transaction.totalBoxesReplacementTo,
                    balanceCost: parseFloat((currentBalanceQty - transaction.totalBoxesReplacementTo) * currentperBox).toFixed(5),
                    avgCostPerBox: currentperBox,
                    Store: storeforDrp.find((item) => item._id == transaction.Store)?.StoreName,
                    location: Location.find((item) => item.value == transaction.LocationFrom)?.label

                });
                currentBalanceQty = currentBalanceQty - transaction.totalBoxesReplacementTo;
                currentBalanceCost -= parseFloat((transaction.totalBoxesReplacementTo * currentperBox).toFixed(5));
            }
            else if (transaction.type === "PurchaseReturn") {

                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: allProduct.find((item1) => item1._id == selectedProduct)?.ProductName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `PurchaseReturn${transaction.invoice}`,
                    type: transaction.type,
                    quantity: parseInt(transaction.totalPurchaseReturnBox),
                    totalCost: ((transaction.totalPurchaseReturnBox) * (currentBalanceCost / currentBalanceQty)).toFixed(5),
                    perBoxCost: currentperBox,
                    balanceQty: currentBalanceQty - transaction.totalPurchaseReturnBox,
                    balanceCost: parseFloat((currentBalanceQty - transaction.totalPurchaseReturnBox) * currentperBox).toFixed(5),
                    avgCostPerBox: currentperBox,
                    Store: storeforDrp.find((item) => item._id == transaction.Store)?.StoreName,
                    location: Location.find((item) => item.value == transaction.LocationFrom)?.label

                });
                currentBalanceQty = currentBalanceQty - transaction.totalPurchaseReturnBox;
                currentBalanceCost -= parseFloat((transaction.totalPurchaseReturnBox * currentperBox).toFixed(5));
            }

            else if (transaction.type == "TransferIn") {
                const StoreAllow = slectedStore.find((item) => item == transaction.StoreTo)
                if (!StoreAllow) return;

                const qty = transaction.totalInBoxes;
                const cost = parseFloat(transaction.TransferInAmount);
                const perBoxCost = (cost / qty).toFixed(4);

                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: productName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `Tr${transaction.TransferCode}`,
                    type: "TransferIn",
                    quantity: qty,
                    perBoxCost,
                    totalCost: cost.toFixed(5),
                    balanceQty: currentBalanceQty += qty,
                    balanceCost: (currentBalanceCost + cost).toFixed(5),
                    avgCostPerBox: ((currentBalanceCost + cost) / (currentBalanceQty)).toFixed(5),
                    Store: storeforDrp.find((item) => item._id == transaction.StoreTo)?.StoreName,
                    location: Location.find((item) => item.value == transaction.LocationFrom)?.label

                });


                currentBalanceCost += cost;
                currentperBox = (currentBalanceCost / currentBalanceQty).toFixed(5);
            }

            else if (transaction.type == "TransferOut") {
                const StoreAllow = slectedStore.find((item) => item == transaction.StoreFrom)
                if (!StoreAllow) return;
                const qty = transaction.totalOutBoxes;
                const totalCost = qty * currentperBox;


                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: productName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `TrOut${transaction.TransferCode}`,
                    type: "Transfer Out",
                    quantity: qty,
                    perBoxCost: currentperBox,
                    totalCost: totalCost.toFixed(5),
                    balanceQty: currentBalanceQty -= transaction.totalOutBoxes,
                    balanceCost: (currentBalanceCost - parseInt(transaction.TrsferOutGrossAmount)).toFixed(5),
                    avgCostPerBox: currentperBox,
                    Store: storeforDrp.find((item) => item._id == transaction.StoreFrom)?.StoreName,
                    location: Location.find((item) => item.value == transaction.LocationFrom)?.label
                });


                currentBalanceCost -= totalCost;
                currentperBox = currentBalanceQty > 0 ? (currentBalanceCost / currentBalanceQty).toFixed(5) : "0.00000";

            }
            else if (transaction.type == "Return") {
                console.log("SalesReturn")
                const qty = transaction.totalReturnBox;
                const cost = parseFloat(transaction.totalValueExclReturnGst);
                const perBoxCost = (cost / qty).toFixed(5);

                rows.push({
                    id: index + 1,
                    date: formatDate(transaction.date),
                    ProductName: productName,
                    SalesFlowRef: transaction.SalesFlowRef,
                    invoice: `Sr${transaction.invoice}`,
                    type: "SR",
                    quantity: qty,
                    perBoxCost,
                    totalCost: cost.toFixed(5),
                    balanceQty: currentBalanceQty += qty,
                    balanceCost: (currentBalanceCost + cost).toFixed(5),
                    avgCostPerBox: ((currentBalanceCost + cost) / (currentBalanceQty)).toFixed(5),
                    Store: storeforDrp.find((item) => item._id == transaction.Store)?.StoreName,
                    location: Location.find((item) => item.value == transaction.Location)?.label

                });


                currentBalanceCost += cost;
                currentperBox = (currentBalanceCost / currentBalanceQty).toFixed(5);
            }
        });


        const columns = [
            { field: 'date', headerName: 'Date', width: 120 },
            { field: 'ProductName', headerName: 'Product Name', width: 400 },
            { field: 'type', headerName: 'Type', width: 100 },
            { field: 'invoice', headerName: 'invoice', width: 100 },
            { field: 'Store', headerName: 'Store', width: 100 },
            { field: 'SalesFlowRef', headerName: 'Sales Flow Ref', width: 150 },

            {
                field: 'quantity',
                headerName: 'Quantity',
                width: 100,
                type: 'number'
            },


            {
                field: 'perBoxCost',
                headerName: 'Cost per Box',
                width: 100,
                type: 'number'
            },

            {
                field: 'totalCost',
                headerName: 'Total Cost',
                width: 120,
                type: 'number',
                valueFormatter: (params) => params?.value
            },
            {
                field: 'balanceQty',
                headerName: 'Balance Qty',
                width: 120,
                type: 'number'
            },
            {
                field: 'balanceCost',
                headerName: 'Balance Cost',
                width: 120,
                type: 'number',
                valueFormatter: (params) => params?.value
            },
            {
                field: 'avgCostPerBox',
                headerName: 'Avg Cost Per Box',
                width: 120,
                type: 'number',
                valueFormatter: (params) => params?.value
            },
        ];
        setColumns(columns)
        setRows(rows)
        setLoading(false)
        return rows;
    }, [data]);


    const getData = async (Startdate, Enddate, selectedProduct, Location, Store) => {
        if (Startdate == null || Enddate == null || selectedProduct == null) {

            return toast.error("Fill form corectly")

        }

        const data = await getDataFundtion(`/InventoryReport/GetDataByDate?startDate=${Startdate}&endDate=${Enddate}&status=Post&product=${selectedProduct}&Location=${Location}&Store=${Store}&damage=Fresh`)
        console.log(`/InventoryReport/GetDataByDate?startDate=${Startdate}&endDate=${Enddate}&status=Post&product=${selectedProduct}&Location=${Location}&Store=${Store}`)
        setData(data)
        setIsLoading(false)
        console.log(data)
        const previosdate = new Date(Startdate);
        previosdate.setDate(previosdate?.getDate() - 1);
        const before = previosdate?.toISOString().split('T')[0];
        setBeforeDate(before)

    }
    const handleSubmit = () => {

        getData(Startdate, Enddate, selectedProduct, selectedLocation, slectedStore)
        setIsModalOpen(false)
    };
    const getProduct = async () => {
        const data = await getDataFundtion("/product")
        setAllProduct(data.data)
        console.log(data.data)
        const Location = await getDataFundtion("/Location")
        const Store = await getDataFundtion("/Store")
        setStoreForDrp(Store.data)
        const allLocation = Location.data.map((item) => ({
            label: item.LocationName,
            value: item._id,
        }));
        setLocation(allLocation)
    }

    const setDrp = (value) => {
        console.log(value)
        setSelectedLocation(value.value)
        const values = value.value;
        setStore([]);
        const userStore = loginVendor.Store
        setSlectedStore(userStore)
        console.log(Store)
        const updatedStoreDrp = storeforDrp?.filter(item => values.includes(item.Location))
            .filter(store => userStore.includes(store._id))
            .map((st) => ({
                label: st.StoreName,
                value: st._id
            }))
        console.log(updatedStoreDrp)
        setStore(updatedStoreDrp)


    }
    const loadInvoiceOptions = async (inputValue) => {
        console.log(allProduct)
        if (!inputValue) return [];

        const filtered = allProduct
            .filter((item) =>
                item.ProductName.toLowerCase().includes(inputValue.toLowerCase()) || item.mastercode.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results

        return filtered.map((item) => ({
            label: `${item.ProductName} ${item.mastercode}`,
            value: item._id
        }));
    };



    useEffect(() => {
        getProduct()
    }, [])

    return (
        <>
            <ToastContainer />

            {isLoading && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-white"></div>
                        <p className="text-white font-semibold">Loading, please wait...</p>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-lg font-semibold mb-4 flex justify-end cursor-pointer" onClick={() => setIsModalOpen(false)}>✕</h2>
                        <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Date From</label>
                                <input
                                    type="date"
                                    value={Startdate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Date to</label>
                                <input
                                    type="date"
                                    value={Enddate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full mt-1 p-2 border rounded-md"
                                />
                            </div>
                            <label className="block text-sm font-medium">Product</label>
                            <div>
                                <AsyncSelect
                                    cacheOptions
                                    onChange={(vals) => setselectedProduct(vals.value)}
                                    loadOptions={loadInvoiceOptions}
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isSearchable
                                    placeholder="Select Product"
                                />
                            </div>
                            <label className="block text-sm font-medium">Location</label>
                            <Select
                                options={Location}
                                onChange={(option) => setDrp(option)}
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable
                                placeholder="Select Location"
                            />
                            <label className="block text-sm font-medium">Store</label>
                            <Select
                                options={Store}
                                onChange={(option) => setSlectedStore([option.value])}
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable
                                placeholder="Select Store"
                            />
                            <button
                                onClick={() => {
                                    setIsLoading(true);
                                    handleSubmit();

                                }}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between my-5 mx-[5%] items-center mb-4">
                <h2 className="text-xl font-bold">Inventory Valuation Report</h2>
                <div className="space-x-2">
                    <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700">Open Filter</button>
                    <button onClick={downloadPDF} className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700">Download PDF</button>
                    <button onClick={downloadExcel} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Download Excel</button>
                </div>
            </div>

            <div className='h-[80vh] w-[80vw] mx-[5%]'>
                <DataGrid loading={loading} rows={rows} columns={columns} pageSize={5} />
            </div>
        </>

    );
};

export default InventoryValutionByProduct;
