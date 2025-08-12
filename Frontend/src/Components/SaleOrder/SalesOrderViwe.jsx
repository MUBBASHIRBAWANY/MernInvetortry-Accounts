import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun } from "docx";
import { saveAs } from "file-saver";
import { getDataFundtion } from "../../Api/CRUD Functions";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const SaleOrderView = () => {
  const [data, setData] = useState({})
  const Products = useSelector((state) => state.Product.product);
  const Store = useSelector((state) => state.Store.Store)
  const Order = useSelector((state) => state.SaleOrder.SaleOrder)
  const location = useSelector((state) => state.Location.Location)
  const Client = useSelector((state) => state.Client.client)

  const { id } = useParams()
  const getData = () => {
    const SaleOrder = Order.find((item) => item._id == id)
    console.log(SaleOrder)
    const wholeData = {
      SaleOrderNumber: SaleOrder.SaleOrderNumber,
      SaleOrderDate: SaleOrder.SaleOrderDate,
      Customer: Client?.find((item)=> item._id == SaleOrder.Customer ).CutomerName,
      Store: Store.find((item) => item._id == SaleOrder.Store).StoreName,
      Location: location.find((item) => item._id == SaleOrder.Location).LocationName,
      SaleOrderData: SaleOrder.SaleOrderData.map((val) => ({
        id: val.id,
        product: Products.find((p) => p._id == val.product).ProductName,
        carton: val.carton,
        Rate: val.rate,
        Amount: val.Amount
      }))
    }

    setData(wholeData)
  }


  useEffect(() => {
    getData()
  }, [])

  // PDF Export
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Your Company Name", 50, 15);
    doc.setFontSize(10);
    doc.text("Address Line 1", 50, 22);
    doc.text("Phone: 123-456-7890", 50, 27);
    doc.text("Email: contact@company.com", 50, 32);

    doc.setFontSize(16);
    doc.text("Sale Order", 15, 50);
    doc.setFontSize(10);
    doc.text(`Order No: ${data.SaleOrderNumber}`, 15, 58);
    doc.text(`Date: ${data.SaleOrderDate}`, 15, 63);
    doc.text(`Customer: ${data.Customer}`, 15, 68);
    doc.text(`Location: ${data.Location}`, 15, 73);
    doc.text(`Store: ${data.Store}`, 15, 78);

    autoTable(doc, {
      startY: 85,
      head: [["#", "Product", "Carton", "Rate", "Amount"]],
      body: data.SaleOrderData.map((item, index) => [
        index + 1,
        item.product,
        item.carton,
        item.Rate,
        item.Amount,
      ]),
    });

    doc.save(`SaleOrder-${data.SaleOrderNumber}.pdf`);
  };

  // Excel Export
  const generateExcel = () => {
    const ws = XLSX.utils.json_to_sheet(data.SaleOrderData?.map((item, index) => ({
      "#": index + 1,
      Product: item.product,
      Carton: item.carton,
      Rate: item.Rate,
      Amount: item.Amount,
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sale Order");
    XLSX.writeFile(wb, `SaleOrder-${data.SaleOrderNumber}.xlsx`);
  };

  // Word Export
  const generateWord = async () => {
    const tableRows = [
      new TableRow({
        children: ["#", "Product", "Carton", "Rate", "Amount"].map(
          (header) => new TableCell({ children: [new Paragraph({ text: header, bold: true })] })
        ),
      }),
      ...data.SaleOrderData?.map(
        (item, index) =>
          new TableRow({
            children: [
              new TableCell({ children: [new Paragraph(String(index + 1))] }),
              new TableCell({ children: [new Paragraph(item.product)] }),
              new TableCell({ children: [new Paragraph(String(item.carton))] }),
              new TableCell({ children: [new Paragraph(String(item.Rate))] }),
              new TableCell({ children: [new Paragraph(String(item.Amount))] }),
            ],
          })
      ),
    ];

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({ text: "Your Company Name", heading: "Heading1" }),
            new Paragraph("Address Line 1"),
            new Paragraph("Phone: 123-456-7890"),
            new Paragraph("Email: contact@company.com"),
            new Paragraph(""),
            new Paragraph({ text: "Sale Order", heading: "Heading2" }),
            new Paragraph(`Order No: ${data.SaleOrderNumber}`),
            new Paragraph(`Date: ${data.SaleOrderDate}`),
            new Paragraph(`Customer: ${data.Customer}`),
            new Paragraph(`Location: ${data.Location}`),
            new Paragraph(`Store: ${data.Store}`),
            new Paragraph(""),
            new Table({
              rows: tableRows,
              width: { size: 100, type: WidthType.PERCENTAGE },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `SaleOrder-${data.SaleOrderNumber}.docx`);
  };

  // Print
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-md rounded-md">
        {/* Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => navigate('/SaleOrder')}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back to List
          </button>
          <button onClick={generatePDF} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">PDF</button>
          <button onClick={generateExcel} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">Excel</button>
          <button onClick={generateWord} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Word</button>
          <button onClick={handlePrint} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Print</button>
        </div>



        {/* Sale Order Info */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Sale Order</h2>
            <p><strong>Order No:</strong> {data.SaleOrderNumber}</p>
            <p><strong>Date:</strong> {data.SaleOrderDate}</p>
          </div>
          <div>
            <p><strong>Customer:</strong> {data.Customer}</p>
            <p><strong>Location:</strong> {data.Location}</p>
            <p><strong>Store:</strong> {data.Store}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full table-auto border">
          <thead className="bg-gray-200">
            <tr>
              <th className="border px-4 py-2">#</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Carton</th>
              <th className="border px-4 py-2">Rate</th>
              <th className="border px-4 py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.SaleOrderData?.map((item, index) => (
              <tr key={item.id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">{item.product}</td>
                <td className="border px-4 py-2">{item.carton}</td>
                <td className="border px-4 py-2">{item.Rate}</td>
                <td className="border px-4 py-2">{item.Amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SaleOrderView;
