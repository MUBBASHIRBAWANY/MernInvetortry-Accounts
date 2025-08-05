import React from 'react';

const PaymentVoucherPrintable = ({ voucherData }) => {
  // Extract data from props
  const voucherDate = voucherData?.VoucherDate || '';
  const voucherNumber = voucherData?.VoucherNumber || '';
  const totalAmount = voucherData?.TotalDebit || 0;
  const accountName = voucherData?.AccountName || '[Name]';
  const accountNumber = voucherData?.AccountNumber || '[Account Number]';
  const items = voucherData?.VoucharData || [];

  return (
    <div id="voucher-print-section" className="p-6 font-sans" style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold underline">CASH PAYMENT VOUCHER</h1>
      </div>

      <div className="mb-6">
        <p><span className="font-semibold">Received From:</span> University of West Georgia Cashier</p>
        <p><span className="font-semibold">Date:</span> {voucherDate}</p>
      </div>

      <div className="mb-8">
        <p className="font-semibold mb-2">For the Following:</p>
        
        <table className="w-full border-collapse border border-gray-800 mb-4">
          <thead>
            <tr>
              <th className="border border-gray-800 p-2 w-1/3">Vendor Name</th>
              <th className="border border-gray-800 p-2 w-1/3">Description of Items Purchased</th>
              <th className="border border-gray-800 p-2 w-1/4">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td className="border border-gray-800 p-2">
                  {item.vendorName || ''}
                </td>
                <td className="border border-gray-800 p-2">
                  {item.Narration || ''}
                </td>
                <td className="border border-gray-800 p-2 text-right">
                  {item.Debit || '0.00'}
                </td>
              </tr>
            ))}
            {/* Empty rows for printing */}
            {[...Array(5 - items.length)].map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-gray-800 p-2 h-8">&nbsp;</td>
                <td className="border border-gray-800 p-2">&nbsp;</td>
                <td className="border border-gray-800 p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-2">
          <div className="flex items-center">
            <span className="font-semibold mr-4">Total:</span>
            <div className="border-b-2 border-black w-32 text-right pr-2">
              {totalAmount.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-12">
        <div>
          <p className="font-semibold">Account Name:</p>
          <div className="border-b-2 border-black mt-1 pb-1">
            {accountName}
          </div>
        </div>
        <div>
          <p className="font-semibold">Account Number:</p>
          <div className="border-b-2 border-black mt-1 pb-1">
            {accountNumber}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <div className="border-t-2 border-black pt-8 text-center">
            <p className="font-semibold">Signature of Purchaser</p>
          </div>
        </div>
        <div>
          <div className="border-t-2 border-black pt-8 text-center">
            <p className="font-semibold">Departmental Approver</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mt-16">
        <div>
          <div className="border-t-2 border-black pt-8 text-center">
            <p className="font-semibold">Cash Recipient</p>
          </div>
        </div>
        <div>
          <div className="border-t-2 border-black pt-8 text-center">
            <p className="font-semibold">Office of Controller/ Business & Finance</p>
          </div>
        </div>
      </div>

      <div className="text-center mt-4 text-sm text-gray-600">
        Voucher: {voucherNumber}
      </div>
    </div>
  );
};

export default PaymentVoucherPrintable;