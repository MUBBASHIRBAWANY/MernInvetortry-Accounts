import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'
import { createDataFunction, deleteDataFunction, getDataFundtion, updateDataFunction } from '../../../../Api/CRUD Functions';
import { toast, ToastContainer } from 'react-toastify';
import { fetchVoucher } from '../../../../Redux/Reducers/VoucherReducer';
import { fetchChqBook } from '../../../../Redux/Reducers/ChqBookReducer';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BankPaymentVoucherView = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
    const Vendor = useSelector((state) => state.Vendor.state);
    const EditVoucher = useSelector((state) => state.VoucherReducer.Voucher);
    const ChqBook = useSelector((state) => state.ChqBook.ChqBook)
    const BankAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer);
    const [unUsedChq, setUnuseChq] = useState([])
    const [chq, setChq] = useState('')
    const [printMode, setPrintMode] = useState(false);


    const store = [{
        _id: "0",
        StoreName: "Head Office",
        StoreCode: "HO"
    }].concat(useSelector((state) => state.Store.Store));

    const [MainAccount, setMainAccount] = useState("");
    const [tableData, setTableData] = useState([]);
    const [PaidFor, setPaidFor] = useState("vendor");
    const [show, setShow] = useState(false)
    const [index, setIndex] = useState("")
    const [headerData, setHeaderData] = useState({
        VoucherDate: "",
        VoucherNumber: "",
        ChequeNumber: "",
        PaidTo: ""
    });

    const dispatch = useDispatch()

    const onSubmit = async () => {
        const voucherData = EditVoucher.find((item) => item._id == id)
        const today = new Date();
        const formatted = today.toISOString().split("T")[0];
        const code = await getDataFundtion('/Voucher/GetLastVouher/BP')
        let nextVoucherNumber = (parseInt(code[0].VoucherNumber.slice('2', "9"))) + 1

        const data = {
            VoucherType: voucherData.VoucherType,
            VoucherNumber: `BP${nextVoucherNumber.toString().padStart(7, '0')}`,
            VoucherDate: formatted,
            VoucherMainAccount: voucherData.VoucherMainAccount,
            VoucharData: tableData,
            ChequeNumber: chq.label,
            ChequeBook: chq.value,
            PaidTo: voucherData.PaidTo,
            PaidFor: voucherData.PaidFor,
            TotalDebit: TotalDebit,
            TotalCredit: TotalCredit
        }
        const UsedChq = {
            chqNumber: [chq.label],
            Status: "used",
        }
        try {
            console.log(data)
            const res = await createDataFunction("/Voucher", data)
            console.log(data.ChequeNumber)
            data.ChequeNumber !== "Online" ? updateDataFunction(`/ChqBook/ChangeStatus/${data.ChequeBook}`, UsedChq) : null

            toast.success("Bank Payment Voucher Updated Successfully")
            console.log(res.voucher._id)
            const allData = await getDataFundtion("/Voucher?&VoucherType=BP");
            const chq = await getDataFundtion("/ChqBook/OpenChq")
            dispatch(fetchChqBook(chq.data));
            dispatch(fetchVoucher(allData.data || []));
            setChq("")
            setTimeout(() => {
                navigate(`/BankPaymentVoucherView/${res.voucher._id}`);
            }, 2000);
        } catch (err) {
            if (err.status === 401) {
                console.log(err.response.data.message)
                toast.error(err.response.data.message)

            } else {
                console.log(err)
                toast.error("some thing went wrong")
            }
        }
    }
    const SetDrp = (val, ps) => {
        setMainAccount(val)
        setUnuseChq([])
        ps === undefined ? setChq('') : null
        const AllChq = ChqBook.filter((item) => item.Bank == val)
            .map((item1) => ({
                id: item1._id,
                chqs: item1.Cheuques[0]
            })).flat()
        const arr = []
        const combined = AllChq.flatMap((item, index) => {
            const id = item._id || item.id;
            Object.entries(item)
            arr.push({
                ref: item.id,
                chq: item.chqs

            })

        });
        let result = [];
        arr.forEach(obj => {
            obj.chq.forEach(innerObj => {
                result.push({
                    ref: obj.ref,
                    chq: innerObj.chq,
                    status: innerObj.status
                });
            });
        });
        const unUsedchq = result.filter((item) => item.status == "unUsed")
            .map((ch) => ({
                value: ch.ref,
                label: ch.chq
            }))
        const online = [{
            value: "Online",
            label: "Online"
        }].concat(unUsedchq)
        setUnuseChq(online)
    }

    const getData = () => {
        const voucherData = EditVoucher.find((item, index) => item._id == id);
        const index = EditVoucher.findIndex((item) => item._id == id);
        setIndex(index)
        if (voucherData) {
            setMainAccount(voucherData.VoucherMainAccount);
            setTableData(voucherData.VoucharData);
            setPaidFor(voucherData.PaidFor);
            SetDrp(voucherData.VoucherMainAccount, 1)
            setHeaderData({
                VoucherDate: voucherData.VoucherDate.split("T")[0],
                VoucherNumber: voucherData.VoucherNumber,
                ChequeNumber: voucherData.ChequeNumber,
                PaidTo: voucherData.PaidTo,
            });
            setShow(false)

        }
    }

    useEffect(() => {
        getData();
    }, [id, EditVoucher]);

    // Helper functions to get display values
    const getAccountLabel = (accountId) => {
        const account = Account.find(a => a._id === accountId);
        return account ? `${account.AccountCode} ${account.AccountName}` : '';
    };

    const getVendorLabel = (vendorId) => {
        const vendor = Vendor.find(v => v._id === vendorId);
        return vendor ? vendor.VendorName : '';
    };

    const getStoreLabel = (storeId) => {
        const storeItem = store.find(s => s._id === storeId);
        return storeItem ? storeItem.StoreName : '';
    };

    const TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
    const TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);
    const [nextVoucherId, setNextVoucherId] = useState(null);
    const [prevVoucherId, setPrevVoucherId] = useState(null);

    // Calculate next/previous vouchers
    useEffect(() => {
        if (EditVoucher.length > 0 && id) {
            // Sort vouchers by date (newest first) then by voucher number
            const sortedVouchers = [...EditVoucher].sort((a, b) => {
                const dateCompare = new Date(b.VoucherDate) - new Date(a.VoucherDate);
                if (dateCompare !== 0) return dateCompare;
                return b.VoucherNumber.localeCompare(a.VoucherNumber);
            });

            const currentIndex = sortedVouchers.findIndex(v => v._id === id);

            if (currentIndex > 0) {
                setNextVoucherId(sortedVouchers[currentIndex - 1]._id);
            } else {
                setNextVoucherId(null);
            }

            if (currentIndex < sortedVouchers.length - 1) {
                setPrevVoucherId(sortedVouchers[currentIndex + 1]._id);
            } else {
                setPrevVoucherId(null);
            }
        }
    }, [EditVoucher, id]);

    // Button handlers
    const handlePrintVoucherCopy = () => {
        setShow(true);
    };
    const handlePrintPDF = async () => {
        const input = document.getElementById("voucher-print-section");
        if (!input) return;
        const pdf = new jsPDF('p', 'pt', 'a4'); // Use 'pt' and 'a4' for precision
        const canvas = await html2canvas(input, {
            scale: 2, // Increase for sharper output
            useCORS: true
        });

        const imgData = canvas.toDataURL("image/png");
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`BankPaymentVoucher_${headerData.VoucherNumber}.pdf`);
    };

    const handlePrintExcel = () => {
        const header = [
            ["Company Name"],
            ["Bank Payment Voucher"],
            [`Voucher Number: ${headerData.VoucherNumber}`],
            [`Voucher Date: ${headerData.VoucherDate}`],
            [`Paid To: ${headerData.PaidTo}`],
            [`Cheque Number: ${headerData.ChequeNumber}`],
            [], // empty row
            ["Account", "Store", "Ref", "Debit", "Credit", "Narration"],
        ];

        const rows = tableData.map((row) => [
            getVendorLabel(row.vendor) || getAccountLabel(row.Account),
            getStoreLabel(row.store),
            row.Ref || "",
            row.Debit || 0,
            row.Credit || 0,
            row.Narration || "",
        ]);

        const totalRow = ["", "", "Total", TotalDebit, TotalCredit, ""];

        const data = [...header, ...rows, totalRow];

        const worksheet = XLSX.utils.aoa_to_sheet(data); // this is key
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Voucher");

        const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([wbout], { type: "application/octet-stream" }), `Voucher_${headerData.VoucherNumber}.xlsx`);

    };

    const handlePrintWord = () => {
        const tableRows = tableData.map((row) => `
    <tr>
      <td>${getVendorLabel(row.vendor) || getAccountLabel(row.Account)}</td>
      <td>${getStoreLabel(row.store)}</td>
      <td>${row.Ref || ""}</td>
      <td>${row.Debit || 0}</td>
      <td>${row.Credit || 0}</td>
      <td>${row.Narration || ""}</td>
    </tr>`).join("");

        const totalRow = `
    <tr>
      <td colspan="3" style="text-align:right;"><strong>Total:</strong></td>
      <td><strong>${TotalDebit}</strong></td>
      <td><strong>${TotalCredit}</strong></td>
      <td></td>
    </tr>`;

        const content = `
  <html xmlns:o='urn:schemas-microsoft-com:office:office' 
        xmlns:w='urn:schemas-microsoft-com:office:word' 
        xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>Voucher</title>
      <style>
        body { font-family: 'Times New Roman', serif; }
        table { border-collapse: collapse; width: 100%; font-size: 14px; }
        th, td { border: 1px solid #000; padding: 6px; text-align: left; }
        h1, h2, p { text-align: center; margin: 0; }
        .header-section { margin-bottom: 20px; }
        .footer-section { margin-top: 40px; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="header-section">
        <h1>Company Name</h1>
        <p>123 Business Street, Karachi | +92-300-0000000</p>
        <h2>Bank Payment Voucher</h2>
      </div>

      <table style="margin-bottom: 20px;">
        <tr><td><strong>Voucher Number:</strong></td><td>${headerData.VoucherNumber}</td></tr>
        <tr><td><strong>Voucher Date:</strong></td><td>${headerData.VoucherDate}</td></tr>
        <tr><td><strong>Paid To:</strong></td><td>${headerData.PaidTo}</td></tr>
        <tr><td><strong>Cheque Number:</strong></td><td>${headerData.ChequeNumber}</td></tr>
        <tr><td><strong>Main Account:</strong></td><td>${getAccountLabel(MainAccount)}</td></tr>
      </table>

      <table>
        <thead>
          <tr>
            <th>${PaidFor === "vendor" ? "Vendor" : "Account"}</th>
            <th>Store</th>
            <th>Ref</th>
            <th>Debit</th>
            <th>Credit</th>
            <th>Narration</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
          ${totalRow}
        </tbody>
      </table>

      <div class="footer-section">
        <p>Prepared By: ____________________</p>
        <p>Approved By: ____________________</p>
        <p>Signature: ______________________</p>
      </div>
    </body>
  </html>
  `;

        const blob = new Blob(['\ufeff', content], {
            type: 'application/msword'
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Voucher_${headerData.VoucherNumber}.doc`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    const handleNextVoucher = () => {
        if (nextVoucherId) {
            navigate(`/bankpaymentvoucherview/${nextVoucherId}`);
        }
    };

    const handlePrevVoucher = () => {
        if (prevVoucherId) {
            navigate(`/bankpaymentvoucherview/${prevVoucherId}`);
        }
    };
  

    const deleteVoucher = async () =>{
        try{
            const res = await deleteDataFunction(`/Voucher/delete/${id}`);
            const data = await getDataFundtion("/Voucher?VoucherType=BP")
            dispatch(fetchVoucher(data.data))
            toast.success("Voucher Delete Successfully")
            setTimeout(()=>{
                handlePrevVoucher()
            }, 2000)
        }catch(err){
            toast.error("Some Thing Went Wrong")
        }
    }
    return (
        <div className="p-4">
            <ToastContainer />
            <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Bank Payment Voucher</h1>
            {show && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

                    <div className="bg-white p-4 rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Voucher Copy</h2>
                            <button onClick={() => setShow(false)} className="text-red-500 text-[20px]"> x </button>
                        </div>
                        <div>
                            <Select onChange={(e)=> setChq(e)} className="basic-single text-sm" menuPortalTarget={document.body} styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }} options={unUsedChq} onClick={(e) => setChq(e)} />
                        </div>
                        <button
                            onClick={() => onSubmit()}
                            type="submit"
                            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
                        >
                            Copy Voucher
                        </button>
                    </div>

                </div>
            )}

            {/* Add button container */}

            <div className="flex flex-wrap justify-center gap-2 mb-4">
                <button
                    onClick={() => navigate("/BankPaymentVoucherList")}
                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 text-sm md:text-base"
                >
                    Back
                </button>
                <button
                    onClick={handlePrintVoucherCopy}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                    Voucher Copy
                </button>
                <button
                    onClick={handlePrintPDF}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                    Print PDF
                </button>
                <button
                    onClick={handlePrintExcel}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                >
                    Print Excel
                </button>
                <button
                    onClick={handlePrintWord}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Print Word
                </button>
                <button
                    onClick={handlePrevVoucher}
                    disabled={!prevVoucherId}
                    className={`px-4 py-2 rounded transition ${prevVoucherId
                        ? 'bg-gray-700 text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Previous Voucher
                </button>
                <button
                    onClick={handleNextVoucher}
                    disabled={!nextVoucherId}
                    className={`px-4 py-2 rounded transition ${nextVoucherId
                        ? 'bg-gray-700 text-white hover:bg-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Next Voucher
                </button>
                <button
                    className={`px-4 py-2 rounded transition bg-blue-500 text-yellow-50`}
                    onClick={()=> navigate(`/BankPaymentVoucherEdit/${id}`)}
                >
                    Edit Voucher
                    
                </button>
                <button
                    className={`px-4 py-2 rounded transition bg-red-500 text-yellow-50`}
                    onClick={()=> deleteVoucher()}
                >
                    Delete Voucher
                    
                </button>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg shadow-md" id="voucher-print-section">
                <div id="voucher-print-section" className="p-6 border border-gray-300 bg-white text-black ">
                    <div className="text-center mb-4">
                        <h1 className="text-2xl font-bold">Company Name</h1>
                        <p className="text-sm">123 Business Road, City, Country | +92-XXX-XXXXXXX</p>
                        <h2 className="text-xl font-bold mt-4 underline">Bank Payment Voucher</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                        <div><strong>Voucher Date:</strong> {headerData.VoucherDate}</div>
                        <div><strong>Voucher Number:</strong> {headerData.VoucherNumber}</div>
                        <div><strong>Paid To:</strong> {headerData.PaidTo}</div>
                        <div><strong>Cheque Number:</strong> {headerData.ChequeNumber}</div>
                        <div><strong>Account:</strong> {getAccountLabel(MainAccount)}</div>
                    </div>


                    <div className="overflow-x-auto mb-6">
                        <table className="w-full border-collapse text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border p-2 min-w-[200px]">{PaidFor == "other" ? "Account" : "Vendor"}</th>
                                    <th className="border p-2" style={{ width: "8vw" }} >Store</th>
                                    <th className="border p-2" style={{ width: "8vw" }}>Ref</th>
                                    <th className="border p-2" style={{ width: "5vw" }}>Debit</th>
                                    <th className="border p-2" style={{ width: "5vw" }}>Credit</th>
                                    <th className="border p-2">Narration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tableData.map((row) => (
                                    <tr key={row.id} className="hover:bg-gray-50">
                                        <td className="border p-2">
                                            {
                                                getVendorLabel(row.vendor) ||
                                                getAccountLabel(row.Account)
                                            }
                                        </td>
                                        <td className="border p-2">
                                            {getStoreLabel(row.store)}
                                        </td>
                                        <td className="border p-2">
                                            {row.Ref || ''}
                                        </td>
                                        <td className="border p-2">
                                            {row.Debit}
                                        </td>
                                        <td className="border p-2">
                                            {row.Credit}
                                        </td>
                                        <td className="border p-2">
                                            {row.Narration || ''}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            {tableData.length !== 0 && (
                                <tfoot>
                                    <tr className="bg-gray-100 font-semibold">
                                        <td className="border p-2"></td>
                                        <td className="border p-2"></td>
                                        <td className="border p-2 text-right">Total:</td>
                                        <td className="border p-2">{TotalDebit}</td>
                                        <td className="border p-2">{TotalCredit}</td>
                                        <td className="border p-2"></td>
                                    </tr>
                                </tfoot>
                            )}
                        </table>
                    </div>
                    <div className="mt-10 grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <p>Prepared By: ___________________</p>
                        </div>
                        <div>
                            <p>Approved By: ___________________</p>
                        </div>
                        <div>
                            <p>Signature: ___________________</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BankPaymentVoucherView;