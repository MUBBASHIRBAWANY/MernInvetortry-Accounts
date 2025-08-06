import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const SaleOrderView = () => {
  const data = {
    SaleOrderNumber: '000001',
    SaleOrderDate: '2025-07-31',
    Customer: 'Customer A',
    Location: 'Location 1',
    Store: 'Main Store',
    SaleOrderData: [
      {
        id: 1754455864526,
        product: 'Product X',
        carton: '5',
        Rate: 5000,
        Amount: 25000,
      },
    ],
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Company Info
    doc.addImage(logo, 'PNG', 15, 10, 30, 30);
    doc.setFontSize(14);
    doc.text('Your Company Name', 50, 15);
    doc.setFontSize(10);
    doc.text('Address Line 1', 50, 22);
    doc.text('Phone: 123-456-7890', 50, 27);
    doc.text('Email: contact@company.com', 50, 32);

    // Sale Order Heading
    doc.setFontSize(16);
    doc.text('Sale Order', 15, 50);
    doc.setFontSize(10);
    doc.text(`Order No: ${data.SaleOrderNumber}`, 15, 58);
    doc.text(`Date: ${data.SaleOrderDate}`, 15, 63);
    doc.text(`Customer: ${data.Customer}`, 15, 68);
    doc.text(`Location: ${data.Location}`, 15, 73);
    doc.text(`Store: ${data.Store}`, 15, 78);

    // Table
    autoTable(doc, {
      startY: 85,
      head: [['#', 'Product', 'Carton', 'Rate', 'Amount']],
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

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white p-8 shadow-md rounded-md">
        {/* Company Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            {/* <img src={logo} alt="Logo" className="h-16 w-16 object-contain" /> */}
            <div>
              <h1 className="text-xl font-bold">Your Company Name</h1>
              <p className="text-sm text-gray-600">Address Line 1</p>
              <p className="text-sm text-gray-600">Phone: 123-456-7890</p>
              <p className="text-sm text-gray-600">Email: contact@company.com</p>
            </div>
          </div>
          <button
            onClick={generatePDF}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
          >
            Download PDF
          </button>
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

        {/* Product Table */}
        <h3 className="text-lg font-semibold mb-4">Product Details</h3>
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
            {data.SaleOrderData.map((item, index) => (
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
