import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import "./InventoryTable.css"
import { getDataFundtion } from '../../Api/CRUD Functions';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver'
import { ToastContainer } from 'react-toastify';
import Select from 'react-select'
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useSelector } from 'react-redux';

const StockFlowReportPopup = ({ data }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([])
  const qtyType = data.qtyType
  const columns = [


    {
      field: 'salesFlowRef',
      headerName: 'SalesFlowRef',
      width: 200,
    },
    {
      field: 'productName',
      headerName: 'Product Name',
      width: 200
    },
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'TotalopenigQty',
        headerName: 'Total Opening Boxes',
        width: 200,
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{

        field: 'TotalopenigCarton',
        headerName: 'Total opening Carton',
        width: 200
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'TotalopenigUnit',
        headerName: 'Total Opening Unit',
        width: 200
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'purchasedBoxes',
        headerName: 'Purchased in Boxes',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'purchasedCarton',
        headerName: 'purchased in Carton',
        width: 150,
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'purchasedUnits',
        headerName: 'Purchased in Unit',
        width: 150,
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'totalPurchaseReturnBox',
        headerName: 'Purchase Return in Box',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'totalPurchaseReturnCarton',
        headerName: 'Purchase Return in Carton',
        width: 150
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'totalPurchaseReturnUnit',
        headerName: 'Purchase Return in Unit',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{

        field: 'soldBoxes',
        headerName: 'Sold Boxes',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'soldCarton',
        headerName: 'Sold Cartons',
        width: 150,
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'soldUnits',
        headerName: 'Sold Units',
        width: 150,
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'totalReturnBox',
        headerName: 'Sale Return in Box',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'totalReturnCarton',
        headerName: 'Sale Return in Carton',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'totalReturnUnit',
        headerName: 'Sale Return in unit',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'totalInBoxes',
        headerName: 'Transfer In Box',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'totalInCarton',
        headerName: 'Transfer In Carton',
        width: 150
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'totalInUnit',
        headerName: 'Transfer In Unit',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'totalOutBoxes',
        headerName: 'Transfer Out in Box',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'totalOutCarton',
        headerName: 'Transfer Out in Carton',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'totalOutUnit',
        headerName: 'Transfer Out in Unit',
        width: 150
      }]
      : []),

    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'totalBoxesReplacementFrom',
        headerName: 'Replacement in Box',
        width: 150
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'totalCartonReplacementFrom',
        headerName: 'Replacement in Carton',
        width: 150,
      }]
      : []),


    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'totalUnitReplacementFrom',
        headerName: 'Replacement in Units',
        width: 150,
        cellClassName: (params) => params.value < 0 ? 'negative-value' : ''
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Carton"
      ? [{
        field: 'remainingCartons',
        headerName: 'Remaining Cartons',
        width: 150,
      }]
      : []),


    ...(qtyType === "Three" || qtyType === "Unit"
      ? [{
        field: 'remainingUnits',
        headerName: 'Remaining Units',
        width: 150,
        cellClassName: (params) => params.value < 0 ? 'negative-value' : ''
      }]
      : []),
    ...(qtyType === "Three" || qtyType === "Box"
      ? [{
        field: 'remainingBoxes',
        headerName: 'Remaining Boxes',
        width: 150,
        cellClassName: (params) => params.value < 0 ? 'negative-value' : ''
      }]
      : []),
    {
      field: 'boxInCarton',
      headerName: 'BoxInCarton',
      width: 150,
    },
    {
      field: 'PcsinBox',
      headerName: 'PcsinBox',
      width: 150,
    },
    {
      field: 'ValueExclGst',
      headerName: 'ValueExclGst',
      width: 150,
    },
    {
      field: 'ValueinClGst',
      headerName: 'ValueinClGst',
      width: 150,
    },

  ];

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
  const processedRows = rows.map((row, index) => ({
    ...row,
    id: index + 1  // Required by MUI DataGrid
  }));
  console.log(data)
  const getData = async () => {
    try {
      const value = await getDataFundtion(`/InventoryReport/GetDataByDate?startDate=${data.startDate}&endDate=${data.endDate}&status=${data.status}&location=${data.Location}&Store=${data.store}&damage=${data.damage}`);
      const productRes = await getDataFundtion('/Product');
      console.log(value)
      const productMap = new Map(productRes.data.map(p => [p._id, p]));
      setProducts(productRes.data);
      const mergedData = value.reduce((acc, item) => {
        const productId = item.product || item.productFrom;
        if (!acc.has(productId)) {
          acc.set(productId, {
            id: productId,
            productId,
            productName: productMap.get(productId)?.ProductName || 'Unknown',
            salesFlowRef: productMap.get(productId)?.salesFlowRef,
            TotalopenigUnit: 0,
            TotalopenigCarton: 0,
            TotalopenigQty: 0,
            totalPurchaseBoxBefore: 0,
            TransferInBoxesBefore: 0,
            totalReturnBoxBefore: 0,
            totalPurchaseReturnBoxBefore: 0,
            TransferOutBoxesBefore: 0,
            totalBoxesToReplacementBefore: 0,
            totalSaleBoxBefore: 0,
            purchasedBoxes: 0,
            purchasedUnits: 0,
            purchasedCarton: 0,
            soldBoxes: 0,
            soldUnits: 0,
            soldCarton: 0,
            totalReturnBox: 0,
            totalReturnUnit: 0,
            totalReturnCarton: 0,
            totalInBoxes: 0,
            totalInUnit: 0,
            totalInCarton: 0,
            totalOutBoxes: 0,
            totalOutUnit: 0,
            totalOutCarton: 0,
            totalPurchaseReturnBox: 0,
            totalPurchaseReturnCarton: 0,
            totalPurchaseReturnUnit: 0,
            totalBoxesReplacementFrom: 0,
            totalUnitReplacementFrom: 0,
            totalCartonReplacementFrom: 0


          });
        }
        const current = acc.get(productId);
        

        // Handle different data types
        if (item.opneingQty) {
          current.TotalopenigQty += Number(item.opneingQty) || 0;
        }
        if (item.totalPurchaseBoxBefore) {
          current.totalPurchaseBoxBefore += Number(item.totalPurchaseBoxBefore) || 0;
        }
        if (item.TransferInBoxesBefore) {
          const storeAvailable = data.store.includes(item.StoreTo)
          if (storeAvailable) {
            current.TransferInBoxesBefore += Number(item.TransferInBoxesBefore) || 0;
          }
        }
        if (item.totalReturnBoxBefore) {
          current.totalReturnBoxBefore += Number(item.totalReturnBoxBefore) || 0;
        }
        if (item.TransferOutBoxesBefore) {
          const storeAvailable = data.store.includes(item.StoreFrom)
          if (storeAvailable) {
            current.TransferOutBoxesBefore += Number(item.TransferOutBoxesBefore) || 0;
          }
        }
        if (item.totalSaleBoxBefore) {
          current.totalSaleBoxBefore += Number(item.totalSaleBoxBefore) || 0;
        }
        if (item.totalPurchaseReturnBoxBefore) {
          
          current.totalSaleBoxBefore += Number(item.totalPurchaseReturnBoxBefore) || 0;
        }
        if (item.totalBoxesToReplacementBefore) {
          current.totalBoxesToReplacementBefore += Number(item.totalBoxesToReplacementBefore) || 0;
          
        }

        if (item.totalPurchaseBox) {
          const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
          const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
          current.purchasedBoxes += Number(item.totalPurchaseBox) || 0;
          current.purchasedUnits += Number(item.totalPurchaseBox * PcsinBox) || 0;
          current.purchasedCarton += Number(item.totalPurchaseBox / BoxinCarton) || 0;

        }
        if (item.totalBoxesReplacementFrom) {
          if (item.productFrom) {
            const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
            const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
            current.totalBoxesReplacementFrom += Number(item.totalBoxesReplacementFrom) || 0;
            current.totalUnitReplacementFrom += Number(item.totalBoxesReplacementFrom * PcsinBox) || 0;
            current.totalCartonReplacementFrom += Number(item.totalBoxesReplacementFrom / BoxinCarton) || 0;
          }

        }
        if (item.totalSaleBox) {
          const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
          const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
          current.soldBoxes += Number(item.totalSaleBox) || 0;
          current.soldUnits += Number(item.totalSaleBox * PcsinBox) || 0;
          current.soldCarton += Number(item.totalSaleBox / BoxinCarton) || 0;

        }
        if (item.totalReturnBox) {
          const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
          const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
          current.totalReturnBox += Number(item.totalReturnBox) || 0;
          current.totalReturnUnit += Number(item.totalReturnBox * PcsinBox) || 0;
          current.totalReturnCarton += Number(item.totalReturnBox / BoxinCarton) || 0;

        }
        if (item.totalOutBoxes) {
          const storeAvailable = data.store.includes(item.StoreFrom)
          if (storeAvailable) {
            const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
            const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
            current.totalOutBoxes += Number(item.totalOutBoxes) || 0;
            current.totalOutUnit += Number(item.totalOutBoxes * PcsinBox) || 0;
            current.totalOutCarton += Number(item.totalOutBoxes / BoxinCarton) || 0;
          }

        }

        if (item.totalPurchaseReturnBox) {
          const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
          const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
          current.totalPurchaseReturnBox += Number(item.totalPurchaseReturnBox) || 0;
          current.totalPurchaseReturnCarton += Number(item.totalPurchaseReturnBox / BoxinCarton) || 0;
          current.totalPurchaseReturnUnit += Number(item.totalPurchaseReturnBox * PcsinBox) || 0;

        }
        if (item.totalInBoxes) {
          const storeAvailable = data.store.includes(item.StoreTo)
          if (storeAvailable) {
            const BoxinCarton = productMap.get(productId)?.BoxinCarton || 1;
            const PcsinBox = productMap.get(productId)?.PcsinBox || 1;
            current.totalInBoxes += Number(item.totalInBoxes) || 0;
            current.totalInUnit += Number(item.totalInBoxes * PcsinBox) || 0;
            current.totalInCarton += Number(item.totalInBoxes / BoxinCarton) || 0;
          }

        }

        return acc;
      }, new Map());


      // Calculate final values
      const finalRows = Array.from(mergedData.values()).map(item => {
        const product = productMap.get(item.productId);
        const boxInCarton = product?.BoxinCarton || 1;
console.log(item.totalBoxesToReplacementBefore)
        return {
          ...item,
          TotalopenigQty: item.TotalopenigQty + item.totalPurchaseBoxBefore + item.TransferInBoxesBefore + item.totalReturnBoxBefore - item.totalPurchaseReturnBoxBefore - item.TransferOutBoxesBefore - item.totalBoxesToReplacementBefore - item.totalSaleBoxBefore,
          TotalopenigCarton: ((item.TotalopenigQty + item.totalPurchaseBoxBefore + item.TransferInBoxesBefore + item.totalReturnBoxBefore - item.totalPurchaseReturnBoxBefore - item.TransferOutBoxesBefore - item.totalBoxesToReplacementBefore - item.totalSaleBoxBefore) / (productMap.get(item.productId)?.BoxinCarton || 1)),
          TotalopenigUnit: ((item.TotalopenigQty + item.totalPurchaseBoxBefore + item.TransferInBoxesBefore + item.totalReturnBoxBefore - item.totalPurchaseReturnBoxBefore - item.TransferOutBoxesBefore - item.totalBoxesToReplacementBefore - item.totalSaleBoxBefore) * (productMap.get(item.productId)?.PcsinBox || 1)),
          remainingBoxes: item.TotalopenigQty + item.totalPurchaseBoxBefore + item.TransferInBoxesBefore + item.totalReturnBoxBefore + item.purchasedBoxes + item.totalReturnBox + item.totalInBoxes - item.soldBoxes - item.totalPurchaseReturnBox - item.totalOutBoxes - item.totalBoxesReplacementFrom - item.totalPurchaseReturnBoxBefore - item.TransferOutBoxesBefore - item.totalBoxesToReplacementBefore - item.totalSaleBoxBefore,
          remainingUnits: ((item.TotalopenigQty + item.totalPurchaseBoxBefore + item.TransferInBoxesBefore + item.totalReturnBoxBefore + item.purchasedBoxes + item.totalReturnBox + item.totalInBoxes - item.soldBoxes - item.totalPurchaseReturnBox - item.totalOutBoxes - item.totalBoxesReplacementFrom - item.totalPurchaseReturnBoxBefore - item.TransferOutBoxesBefore - item.totalBoxesToReplacementBefore - item.totalSaleBoxBefore) * (productMap.get(item.productId)?.PcsinBox || 1)),
          remainingCartons: ((item.TotalopenigQty + item.totalPurchaseBoxBefore + item.TransferInBoxesBefore + item.totalReturnBoxBefore + item.purchasedBoxes + item.totalReturnBox + item.totalInBoxes - item.soldBoxes - item.totalPurchaseReturnBox - item.totalOutBoxes - item.totalBoxesReplacementFrom - item.totalPurchaseReturnBoxBefore - item.TransferOutBoxesBefore - item.totalBoxesToReplacementBefore - item.totalSaleBoxBefore) / (productMap.get(item.productId)?.BoxinCarton || 1)),
          boxInCarton: productMap.get(item.productId)?.BoxinCarton,
          PcsinBox: productMap.get(item.productId)?.PcsinBox,
        };
      });

      setRows(finalRows);
      setLoading(false)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error);
    }

  }
  useEffect(() => {
    getData()
  }, [data])

  console.log(rows)
  const styles = {
    container: {
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#fff',
    },
    heading: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '16px',
      color: '#333',
    },
    tableWrapper: {
      overflowX: 'auto',
      border: '1px solid #ddd',
      borderRadius: '8px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px',
    },
    th: {
      textAlign: 'left',
      padding: '10px 12px',
      backgroundColor: '#f3f4f6',
      color: '#333',
      borderBottom: '1px solid #ddd',
    },
    td: {
      textAlign: 'left',
      padding: '10px 12px',
      borderBottom: '1px solid #ddd',
      color: '#444',
    },
    rowHover: {
      backgroundColor: '#f9fafb',
    },
  };
  console.log(rows.lengths)
  return (
    <div className="inventory-container">
      <h2 className="inventory-heading">Inventory Report</h2>

      {rows.length === 0 ? (
        <div className="loader-wrapper">
          <div className="spinner"></div>
        </div>
      ) : (
        <div className="inventory-table-wrapper">
          <table className="inventory-table">
            <thead>
              <tr>
                <th style={{ textAlign: 'center' }}>#</th>
                <th className='PrName'>Product Name</th>
                <th>SKU</th>
                {qtyType === "Three" || qtyType === "Box" ? <th>Opening Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ?<th>Opening  Carton</th> : null }
                {qtyType === "Three" || qtyType === "Unit" ? <th>Opening  Unit</th> : null }
                {qtyType === "Three" || qtyType === "Box" ? <th>Purchased Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ? <th>Purchased Carton</th> : null }
                {qtyType === "Three" || qtyType === "Unit" ? <th>Purchased Unit</th> : null }
                {qtyType === "Three" || qtyType === "Box" ?  <th>Transfer In Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ? <th>Transfer In Carton</th> : null }
                {qtyType === "Three" || qtyType === "Unit" ? <th>Transfer In Unit</th> : null }
                {qtyType === "Three" || qtyType === "Box" ? <th>Sale Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ? <th>Sale Carton</th> : null }
                {qtyType === "Three" || qtyType === "Unit" ? <th>Sale Unit</th> : null }
                {qtyType === "Three" || qtyType === "Box" ? <th>Replacement Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ? <th>Replacement Carton</th> : null }
                {qtyType === "Three" || qtyType === "Unit" ? <th>Replacement Unit</th> : null }
                {qtyType === "Three" || qtyType === "Box" ? <th>Transfer Out Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ? <th>Transfer Out Carton</th> : null}
                {qtyType === "Three" || qtyType === "Unit" ? <th>Transfer Out Unit</th> : null}
                {qtyType === "Three" || qtyType === "Box" ? <th>Sales Return Boxes</th> : null }
                {qtyType === "Three" || qtyType === "Carton" ? <th>Sales Return Carton</th> : null}
                {qtyType === "Three" || qtyType === "Unit" ?  <th>Sales Return Unit</th> : null}
                {qtyType === "Three" || qtyType === "Box" ? <th>Purchase Return Boxes</th> : null}
                {qtyType === "Three" || qtyType === "Carton" ? <th>Purchase Return Carton</th> : null}
                {qtyType === "Three" || qtyType === "Unit" ? <th>Purchase Return Unit</th> : null}
                {qtyType === "Three" || qtyType === "Box" ? <th>Remaining Boxes</th> : null}
                {qtyType === "Three" || qtyType === "Carton" ? <th>Remaining Carton</th> : null}
                {qtyType === "Three" || qtyType === "Unit" ? <th>Remaining Unit</th> : null}

              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{item.productName}</td>
                  <td>{item.salesFlowRef}</td>
                {qtyType === "Three" || qtyType === "Box" ?  <td>{item.TotalopenigQty.toLocaleString()}</td> :null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.TotalopenigCarton.toLocaleString()}</td> : null}
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.TotalopenigUnit.toLocaleString()}</td> : null}
                  {qtyType === "Three" || qtyType === "Box" ? <td>{item.purchasedBoxes.toLocaleString()}</td>  :null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.purchasedCarton.toLocaleString()}</td> :null }
                  {qtyType === "Three" || qtyType === "Unit" ?  <td>{item.purchasedUnits.toLocaleString()}</td> :null }
                  {qtyType === "Three" || qtyType === "Box" ? <td>{item.totalInBoxes.toLocaleString()}</td> :null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.totalInCarton.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ?  <td>{item.totalInUnit.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Box" ? <td>{item.soldBoxes.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.soldCarton.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.soldUnits.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Box" ? <td>{item.totalBoxesReplacementFrom.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.totalCartonReplacementFrom.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.totalUnitReplacementFrom.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Box" ? <td>{item.totalOutBoxes.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.totalOutCarton.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.totalOutUnit.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Box" ? <td>{item.totalReturnBox.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.totalReturnCarton.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.totalReturnUnit.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Box" ?  <td>{item.totalPurchaseReturnBox.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Carton" ? <td>{item.totalPurchaseReturnCarton.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.totalPurchaseReturnUnit.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Box" ?  <td>{item.remainingBoxes.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Carton" ?  <td>{item.remainingCartons.toLocaleString()}</td> : null }
                  {qtyType === "Three" || qtyType === "Unit" ? <td>{item.remainingUnits.toLocaleString()}</td> : null }



                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Inline CSS Styles */}
      <style>{`
      .PrName {
            min-width: 250px;
      }
      
        .inventory-container {
          padding: 20px;
          font-family: Arial, sans-serif;
          background-color: #fff;
        }
      
        .inventory-heading {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 16px;
          color: blue;
           text-align: center;
        }

        .inventory-table-wrapper {
           scrollbar-width: thin;
           scrollbar-color: #888 #f1f1f1;
           overflow-y: hidden;
           border: 1px solid #ddd;
           border-radius: 8px;
            min-width: 5000px;
          padding-bottom: 10px;   
        }

        .inventory-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 600px;
        }

        .inventory-table th,
        .inventory-table td {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 1px solid #ddd;
          border-right : 1px solid #ddd
        }

        .inventory-table th {
          background-color: #f3f4f6;
          color: #333;
        }

        .inventory-table tr:hover {
          background-color: #f9fafb;
        }

        .inventory-table td {
          color: #444;
        }

        .loader-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 6px solid #ccc;
          border-top: 6px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default StockFlowReportPopup