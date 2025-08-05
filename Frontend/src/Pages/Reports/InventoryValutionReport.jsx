import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { getDataFundtion } from '../../Api/CRUD Functions';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

const InventoryValuationReport = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [date, setDate] = useState(null);
  const [Allproduct, setAllproduct] = useState([]);
  const [rows, setRows] = useState([]);

  

  const getData = async (date) => {
    const data = await getDataFundtion(`InventoryReport/GetDataByDate?startDate=${date}&endDate=${date}&status=Post`);
    console.log(data)
    const openingData = data.filter((item) => "opneingQty" in item);
    const purchaseDataBefore = data.filter((item) => "totalPurchaseBoxBefore" in item);
    const purchaseData = data.filter((item) => "totalPurchaseBox" in item);
    const totalSaleBox = data.filter((item) => "totalSaleBox" in item);
    const totalSaleBoxBefore = data.filter((item) => "totalSaleBoxBefore" in item);
    const products = await getDataFundtion('product');
    setAllproduct(products.data);

    const aggregateSales = () => {
      const combined = {};
      totalSaleBox.forEach(item => {
        const id = item.product;
        if (!combined[id]) {
          combined[id] = { product: id, totalSaleBox: 0, totalSaleUnits: 0, totalValueExclGst: 0 };
        }
        combined[id].totalSaleBox += item.totalSaleBox || 0;
        combined[id].totalSaleUnits += item.totalSaleUnits || 0;
        combined[id].totalValueExclGst += item.totalValueExclSaleGst || 0;
      });
      totalSaleBoxBefore.forEach(item => {
        const id = item.product;
        if (!combined[id]) {
          combined[id] = { product: id, totalSaleBox: 0, totalSaleUnits: 0, totalValueExclGst: 0 };
        }
        combined[id].totalSaleBox += item.totalSaleBoxBefore || 0;
        combined[id].totalValueExclGst += item.TotalValueExclGstBefore || 0;
      });
      return Object.values(combined);
    };

    const aggregatedSalesData = aggregateSales();

    const aggregatePurchases = () => {
      const combined = {};
      purchaseDataBefore.forEach(item => {
        const id = item.product;
        if (!combined[id]) {
          combined[id] = { product: id, totalPurchaseBox: 0, totalPurchaseValueExclGst: 0 };
        }
        combined[id].totalPurchaseBox += item.totalPurchaseBoxBefore || 0;
        combined[id].totalPurchaseValueExclGst += item.totalPurchaseValueExclGst || 0;
      });
      purchaseData.forEach(item => {
        const id = item.product;
        if (!combined[id]) {
          combined[id] = { product: id, totalPurchaseBox: 0, totalPurchaseValueExclGst: 0 };
        }
        combined[id].totalPurchaseBox += item.totalPurchaseBox || 0;
        combined[id].totalPurchaseValueExclGst += item.totalPurchaseValueExclGst || 0;
      });
      return Object.values(combined);
    };

    const aggregatedData = aggregatePurchases();
    const summary = calculateFinalSummary(openingData, aggregatedData, aggregatedSalesData);
    setRows(summary);
  };

  function calculateFinalSummary(opening, purchases, sales) {
    const allProducts = new Set([
      ...opening.map((o) => o.product),
      ...purchases.map((p) => p.product),
      ...sales.map((s) => s.product)
    ]);
    const summary = [];

    allProducts.forEach((product) => {
      const productTransactions = [];
      opening.filter(o => o.product === product).forEach((o) => {
        productTransactions.push({ date: new Date('2025-01-01'), type: 'Opening', qty: o.opneingQty, unitCost: o.opneingQtyValueExclGst });
      });
      purchases.filter(p => p.product === product).forEach((p) => {
        productTransactions.push({ date: new Date(p.PurchaseInvoiceDate), type: 'Purchase', qty: p.totalPurchaseBox, unitCost: p.totalPurchaseValueExclGst / p.totalPurchaseBox });
      });
      sales.filter(s => s.product === product).forEach((s) => {
        productTransactions.push({ date: new Date(s.SalesInvoiceDate), type: 'Issue', qty: s.totalSaleBox });
      });

      productTransactions.sort((a, b) => a.date - b.date);

      let balanceQty = 0;
      let balanceCost = 0;
      let avgCost = 0;

      productTransactions.forEach((t) => {
        if (t.type === 'Purchase' || t.type === 'Opening') {
          const transactionCost = t.qty * t.unitCost;
          balanceCost += transactionCost;
          balanceQty += t.qty;
          avgCost = balanceQty !== 0 ? balanceCost / balanceQty : 0;
        } else if (t.type === 'Issue') {
          const issueQty = t.qty;
          const issueCost = issueQty * avgCost;
          balanceQty -= issueQty;
          balanceCost -= issueCost;
        }
      });

      summary.push({
        id: product,
        product,
        date: formatDate(date),
        balanceQty,
        balanceCost: balanceCost.toFixed(5),
        avgCost: avgCost.toFixed(5)
      });
    });

    return summary;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(",", "");
  };

  const handleSubmit = () => {
    if (date) {
      getData(date);
      setIsModalOpen(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Product', 'Date', 'Balance Qty', 'Balance Cost', 'Avg Cost of Box']],
      body: rows.map(row => [
        Allproduct.find(p => p._id === row.product)?.ProductName || 'Unknown',
        row.date, row.balanceQty, row.balanceCost, row.avgCost
      ])
    });
    doc.save('Inventory_Valuation_Report.pdf');
  };

 const downloadExcel = () => {
  const dataWithProductNames = rows.map(row => {
    const product = Allproduct.find(p => p._id === row.product);
    return {
      Product: product ? product.ProductName : 'Unknown',
      Date: row.date,
      'Balance Qty': row.balanceQty,
      'Balance Cost': row.balanceCost,
      'Avg Cost of Box': row.avgCost
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(dataWithProductNames);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
  XLSX.writeFile(workbook, "Inventory_Valuation_Report.xlsx");
};


  const columns = [
    {
      field: 'product', headerName: 'Product', width: 400, renderCell: (params) => {
        const Product = Allproduct.find(Product => Product._id === params.value);
        return Product ? `${Product.ProductName} (${Product.code})` : 'Vendor Not Found';
      }
    },
    { field: 'date', headerName: 'Date', width: 200 },
    { field: 'balanceQty', headerName: 'Balance Qty', width: 200 },
    { field: 'balanceCost', headerName: 'Balance Cost', width: 200 },
    { field: 'avgCost', headerName: 'Avg Cost of Box', width: 200 }
  ];

  return (
    <div style={{ height: "80vH", width: '70%' }} className='ml-[5%]'>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4 flex justify-end cursor-pointer" onClick={() => setIsModalOpen(false)}>✕</h2>
            <h2 className="text-lg font-semibold mb-4">Select Date Range</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium"> Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full mt-1 p-2 border rounded-md"
                />
              </div>
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Inventory Valuation Summary</h2>
        <div className="space-x-2">
          <button onClick={() => setIsModalOpen(true)} className="bg-green-600 text-white py-1 px-3 rounded hover:bg-green-700">Open Filter</button>
          <button onClick={downloadPDF} className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700">Download PDF</button>
          <button onClick={downloadExcel} className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600">Download Excel</button>
        </div>
      </div>

      <DataGrid rows={rows} columns={columns} pageSize={10} className='gap-1' getRowId={(row, index) => `${row.date}-${index}`} />
    </div>
  );
};

export default InventoryValuationReport;