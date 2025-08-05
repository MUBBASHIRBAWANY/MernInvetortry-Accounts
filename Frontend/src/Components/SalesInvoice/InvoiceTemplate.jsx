// src/components/InvoiceTemplate.jsx
import React from 'react';

const InvoiceTemplate = ({ data }) => {
  // Function to handle null values
  const handleNull = (value) => {
    return value === null || value === undefined ? 'N/A' : value;
  };

  return (
    <div className="font-sans text-xs">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-base font-bold uppercase tracking-wider">{data.company.name}</h1>
        <p className="text-gray-700">{data.company.address}</p>
        <div className="flex justify-center gap-3 mt-1">
          <span>N.T.N No: {handleNull(data.company.ntn)}</span>
          <span>Sales Tax #: {handleNull(data.company.salesTax)}</span>
          <span>CNIC #: {handleNull(data.company.cnic)}</span>
        </div>
      </div>

      {/* Client Info */}
      <div className="border border-gray-800 p-2 mb-4">
        <p className="font-semibold">{handleNull(data.client.name)}</p>
        <p>Address: {handleNull(data.client.address)}</p>
      </div>

      {/* Products Table */}
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full border-collapse border border-gray-800">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-800 p-1 text-left w-48">Item / Product Name</th>
              <th className="border border-gray-800 p-1">Unit / Carton</th>
              <th className="border border-gray-800 p-1">CTN Box Units</th>
              <th className="border border-gray-800 p-1">Value Excl: Gst per Box</th>
              <th className="border border-gray-800 p-1">Total Value Excl: GST</th>
              <th className="border border-gray-800 p-1">RP Value Excl: GST</th>
              <th className="border border-gray-800 p-1">GST on RP Value @ 18%</th>
              <th className="border border-gray-800 p-1">RP Value Incl: GST</th>
              <th className="border border-gray-800 p-1">GST @ 18% per Box</th>
              <th className="border border-gray-800 p-1">Gross Amount Incl: GST</th>
              <th className="border border-gray-800 p-1">Advance Tax</th>
              <th className="border border-gray-800 p-1">Total Discount</th>
              <th className="border border-gray-800 p-1">Net Amount</th>
              <th className="border border-gray-800 p-1">R F</th>
            </tr>
          </thead>
          <tbody>
            {data.products.map((product, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="border border-gray-600 p-1">{handleNull(product.id)} {handleNull(product.name)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.unitCarton)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.ctnBoxUnits)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.valueExclGst)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.totalValueExclGst)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.rpValueExclGst)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.gstOnRp)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.rpValueInclGst)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.gstPerBox)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.grossAmount)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.advanceTax)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.totalDiscount)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.netAmount)}</td>
                <td className="border border-gray-600 p-1 text-right">{handleNull(product.rf)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Promotions Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <h3 className="font-bold mb-1">Promotions Applied</h3>
          <table className="w-full border-collapse border border-gray-800">
            <tbody>
              {data.promotions.map((promo, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-600 p-1 w-3/4">{handleNull(promo.name)}</td>
                  <td className="border border-gray-600 p-1 text-right">{handleNull(promo.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex-1">
          <h3 className="font-bold mb-1">Total Discount</h3>
          <div className="border border-gray-800 p-2 h-full">
            <p className="font-semibold">Local Form # {handleNull(data.invoice.localForm)}</p>
            <p>Karachi</p>
          </div>
        </div>
      </div>

      {/* Signatures */}
      <div className="flex justify-between mb-4 mt-6">
        <div className="text-center">
          <p className="font-semibold border-t border-black pt-1 w-32">Checked By Order Booker</p>
        </div>
        <div className="text-center">
          <p className="font-semibold border-t border-black pt-1 w-32">Delivered By</p>
        </div>
        <div className="text-center">
          <p className="font-semibold border-t border-black pt-1 w-32">Shop Keeper</p>
        </div>
      </div>

      {/* Invoice Footer */}
      <div className="text-center border-t border-black pt-4">
        <h2 className="text-sm font-bold uppercase">CASH MEMO / INVOICE</h2>
        <div className="flex justify-center gap-6 mt-1">
          <span>Sales Tax No : {handleNull(data.company.cnic)}</span>
          <span>N.T.N No: {handleNull(data.company.cnic)}</span>
        </div>
        <div className="flex justify-between mt-4">
          <div>
            <p>Invoice No # : {handleNull(data.invoice.number)}</p>
          </div>
          <div>
            <p>Date/Day : {handleNull(data.invoice.date)}</p>
          </div>
          <div>
            <p>Route : {handleNull(data.invoice.route)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceTemplate;