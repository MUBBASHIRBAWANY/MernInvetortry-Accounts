// PurchaseReturnView.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getDataFundtion, updateDataFunction } from '../../Api/CRUD Functions';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, TextRun } from "docx";
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';

const PurchaseReturnView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const Products = useSelector((state) => state.Product.product);
  const Vendor = useSelector((state) => state.Vendor.state);
  const Store = useSelector((state) => state.Store.Store);
  const location = useSelector((state) => state.Location.Location);
  const PurchaseReturns = useSelector((state) => state.PurchaseReturn.PurchaseReturn);
  const loginVendor = useSelector((state) => state.LoginerReducer.userDetail);
  const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
  const [status, setStatus] = useState(false);
  const [data, setData] = useState(null);
  const [filterProduct, setFilterProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucherData, setVoucherData] = useState([])
  const Admin = useSelector((state) => state.AdminReducer.AdminReducer)
const navigate = useNavigate()
console.log(Admin)


  useEffect(() => {
    const init = async () => {
      try {
        if (Products.length === 0) {
          const res = await getDataFundtion('/product');
          dispatch(fetchproduct(res.data));
        }

        const currentData = PurchaseReturns.find((item) => item._id === id);
        if (currentData) {
          setData(currentData);
          console.log(currentData)
          setStatus(currentData?.PostStatus);
          const vendorCode = Vendor.find(v => v._id === currentData.Vendor)?.code;
          const vendorProducts = Products
          setFilterProduct(vendorProducts);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
    
    

  }, [id]);

  if (loading || !data) return <div className="text-center py-10">Loading...</div>;

  const getProductName = (id) => {
    const p = Products.find(prod => prod._id === id);
    return p ? `${p.ProductName}` : 'N/A';
  };

  const getVendorName = (id) => Vendor.find(v => v._id === id)?.VendorName || 'N/A';
  const getLocationName = (id) => location.find(l => l._id === id)?.LocationName || 'N/A';
  const getStoreName = (id) => Store.find(s => s._id === id)?.StoreName || 'N/A';
  const Voucher = async (id) => {
    console.log(data)
    const data1 = await getDataFundtion(`/Voucher/getVoucherByNumber/Prr${data.PurchaseReturn}`)
    console.log(data1)
    setVoucherData(data1.data[0])
  }


  const exportToExcel = () => {
    const headerInfo = [
      { Field: "Purchase Return No", Value: data?.PurchaseReturn },
      { Field: "Invoice Date", Value: new Date(data?.PurchaseReturnDate).toLocaleDateString('en-GB') },
      { Field: "Vendor", Value: Vendor.find(v => String(v._id) === String(data?.Vendor))?.VendorName },
    ];

    const worksheet = XLSX.utils.json_to_sheet(headerInfo);

    XLSX.utils.sheet_add_json(
      worksheet,
      data.PurchaseReturnData.map(row => ({
        Product: getProductName(row.product),
        CTN: row.carton,
        Rate: row.Rate,
        GrossAmount: row.GrossAmount,
        Discount: row.discount,
        AfterDiscount: row.ValueAfterDiscout,
        GST: row.Gst,
        NetAmount: row.netAmunt
      })),
      { origin: "A4" } // Start table after header info
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseReturn");
    XLSX.writeFile(workbook, `PurchaseReturn_${data?.PurchaseReturn}.xlsx`);
  };


  // Export to PDF
  const exportToPDF = () => {
    const doc = new jsPDF();

    // Header info
    doc.setFontSize(14);
    doc.text(`Purchase Return No: ${data?.PurchaseReturn}`, 14, 20);
    doc.text(`Invoice Date: ${data?.PurchaseReturnDate}`, 14, 28);
    doc.text(`Vendor: ${Vendor.find(v => v._id === data?.Vendor)?.VendorName}`, 14, 36);

    // Table
    autoTable(doc, {
      startY: 54,
      head: [['Product', 'CTN', 'Rate', 'Gross Amount', 'Discount', 'GST', 'Net Amount']],
      body: data.PurchaseReturnData.map(row => [
        getProductName(row.product),
        row.carton,
        row.Rate,
        row.GrossAmount,
        row.discount,
        row.Gst,
        row.netAmunt
      ])
    });

    doc.save(`PurchaseReturn_${data?.PurchaseReturn}.pdf`);
  };


  // Export to Word
  const exportToWord = async () => {
    const headerRows = [
      { Field: "Purchase Return No", Value: data?.PurchaseReturn },
      { Field: "Invoice Date", Value: new Date(data?.PurchaseReturnDate).toLocaleDateString('en-GB') },
      { Field: "Vendor", Value: Vendor.find(v => v._id === data?.Vendor)?.VendorName },
    ].map(({ Field, Value }) =>
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: Field, bold: true })] }),
          new TableCell({ children: [new Paragraph(String(Value ?? ''))] })
        ]
      })
    );

    const tableRows = [
      new TableRow({
        children: [
          'Product', 'CTN', 'Gross Amount', 'Discount', 'GST', 'Net Amount'
        ].map(h => new TableCell({ children: [new Paragraph({ text: h, bold: true })] }))
      }),
      ...data.PurchaseReturnData.map(row =>
        new TableRow({
          children: [
            getProductName(row.product),
            row.carton,
            row.GrossAmount,
            row.discount,
            row.Gst,
            row.netAmunt
          ].map(v => new TableCell({ children: [new Paragraph(String(v ?? ''))] }))
        })
      )
    ];

    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({ text: `Purchase Invoice - ${data?.PurchaseReturn}`, heading: "Heading1" }),
          new Table({ rows: headerRows, width: { size: 100, type: WidthType.PERCENTAGE } }),
          new Paragraph({ text: "" }), // spacing
          new Table({ rows: tableRows, width: { size: 100, type: WidthType.PERCENTAGE } })
        ]
      }]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `PurchaseReturn_${data?.PurchaseReturn}.docx`);
  };


  // Print Invoice
  const printInvoice = () => {
    window.print();
  };

  const handlePostUnpost = async (val) => {
    console.log(val)


    const ReturnData = {
      inv: data.InvoiceRef,
      id: data._id,
      Store: data.Store,
      Location: data.Location,
      returnData: data.PurchaseReturnData,
      status: val,
      AccountsData : {
        VoucherType: "Prr",
        VoucherNumber: `Prr${data.PurchaseReturn}`,
        status: "Post",
        VoucherDate: data.PurchaseReturnDate,
        VoucharData: [
          {
            Account: Accounts.find((val)=> val.AccountCode == Vendor.find((item)=> item._id === data.Vendor).AccountCode)._id,
            Debit: data.PurchaseReturnData.reduce((sum, row) => sum + (parseFloat(row.ValueAfterDiscout) || 0), 0),
            store: data.Store,
          },
          {
            Account: Admin.finishedGoods,
            Credit: data.PurchaseReturnData.reduce((sum, row) => sum + (parseFloat(row.GrossAmount) || 0), 0),
            store: data.Store,
          },
          {
            Account: Admin.PurchaseDiscount,
            Debit: data.PurchaseReturnData.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0),
            store: data.Store,
          },
          {
            Account: Admin.Gst,
            Credit: data.PurchaseReturnData.reduce((sum, row) => sum + (parseFloat(row.Gst) || 0), 0),
            store: data.Store,
          },
        ]
          .filter(
            item => (item.Debit ?? 0) !== 0 || (item.Credit ?? 0) !== 0
          )

      }
    }

    try {
      const res = await updateDataFunction(`PurchaseReturn/Changestatus/${ReturnData.id}`, ReturnData)
      toast.success("Status Updated")
      setStatus(val)
    setTimeout(()=>{
      navigate("/PurchaseReturn")
    },2000)
    } catch (err) {
    toast.error("Some Thing Went Wrong")
      console.log(err)
    }

  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className='p-4'>
        <div className='flex justify-between mb-1'>
          <h1 className="text-3xl font-bold text-center  text-gray-800 mb-2">View Purchase Return</h1>
          <div className="flex gap-4">

            {status === false && (
              <>
                <button
                  onClick={() => handlePostUnpost(true)}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Post Invoice
                </button>
              </>
            )}
            {status === true && (
              <>
                <button
                  onClick={() => Voucher(PurchaseReturns.PurchaseReturn)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Voucher
                </button>
                <button
                  onClick={() => handlePostUnpost(false)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Unpost Invoice
                </button>
              </>
            )}

            <button
              onClick={() => navigate('/PurchaseReturnList')}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to List
            </button>
            <button onClick={exportToExcel} className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">Excel</button>
            <button onClick={exportToWord} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Word</button>
            <button onClick={exportToPDF} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">PDF</button>
            <button onClick={printInvoice} className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">Print</button>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold">Return Date</label>
              <p className="mt-1">{data.PurchaseReturnDate?.split('T')[0]}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Vendor</label>
              <p className="mt-1">{getVendorName(data.Vendor)}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Purchase Return No</label>
              <p className="mt-1">{data.PurchaseReturn}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Location</label>
              <p className="mt-1">{getLocationName(data.Location)}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Store</label>
              <p className="mt-1">{getStoreName(data.Store)}</p>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold">Purchase invoice</label>
              <p className="mt-1">{data.InvoiceRef}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-36">Product</th>
                  <th className="border p-2">CTN</th>
                  <th className="border p-2">Rate</th>
                  <th className="border p-2">Trade Value Exc. All Taxes</th>
                  <th className="border p-2">Discount </th>
                  <th className="border p-2"> Trade Value After Discount</th>
                  <th className="border p-2">Gst</th>
                  <th className="border p-2">Net Amount </th>
                </tr>
              </thead>
              <tbody>
                {data.PurchaseReturnData.map((row) => (
                  <tr key={row.id}>
                    <td className="border px-4 py-2">{getProductName(row.product)}</td>
                    <td className="border px-4 py-2">{row.carton}</td>
                    <td className="border px-4 py-2">{row.Rate}</td>
                    <td className="border px-4 py-2">{row.GrossAmount}</td>
                    <td className="border px-4 py-2">{row.discount}</td>
                    <td className="border px-4 py-2">{row.ValueAfterDiscout}</td>
                    <td className="border px-4 py-2">{row.Gst}</td>
                    <td className="border px-4 py-2">{row.netAmunt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">📄 Voucher Details</h2>
          <div className="grid grid-cols-2 gap-4 text-gray-700">
            <div><strong>Voucher Number:</strong>{voucherData?.VoucherNumber}</div>
            <div><strong>Voucher Date:</strong> {voucherData?.VoucherDate}</div>
            <div><strong>Voucher Type:</strong> {voucherData?.VoucherType}</div>
            <div><strong>Status:</strong> {voucherData?.status}</div>
          </div>
        </div>

        {/* Table */}
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💰 Voucher Entries</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 border">#</th>
                  <th className="px-4 py-2 border">Account</th>
                  <th className="px-4 py-2 border">Debit</th>
                  <th className="px-4 py-2 border">Credit</th>
                  <th className="px-4 py-2 border">Store</th>
                </tr>
              </thead>
              <tbody>

                {voucherData?.VoucharData?.map((item, index) => (

                  <tr key={index} className="text-center hover:bg-gray-50">
                    <td className="px-4 py-2 border">{index + 1}</td>
                    <td className="px-4 py-2 border">{Accounts.find((ac) => ac._id === item.Account)?.AccountName}({Accounts.find((ac) => ac._id === item.Account)?.AccountCode})</td>
                    <td className="px-4 py-2 border">
                      {item.Debit !== undefined ? item.Debit.toLocaleString() : '–'}
                    </td>
                    <td className="px-4 py-2 border">
                      {item.Credit !== undefined ? item.Credit.toLocaleString() : '–'}
                    </td>
                    <td className="px-4 py-2 border"> {Store.find((st) => st._id === item.store).StoreName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
};

export default PurchaseReturnView;
