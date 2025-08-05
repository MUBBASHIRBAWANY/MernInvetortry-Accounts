import Select from 'react-select';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';

const InvoiceSelectionModal = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const invoices = useSelector((state) => state.PurchaseInvoice.PurchaseInvoice)
    const Admin = useSelector((state) => state.AdminReducer.AdminReducer)



    const invoiceOptions = invoices.filter((item) => item.PostStatus !== true).map((item) => {
        return ({
            value: item.PurchaseInvoice,
            label: item.PurchaseInvoice
        })
    })

    const handleSubmit = async (e) => {
        console.log("first")
        e.preventDefault();
        console.log("false")

        // Handle form submission
        console.log(selectedInvoiceFrom.value, selectedInvoiceTo.value);
        if (selectedInvoiceFrom.value > selectedInvoiceTo.value) {
            return toast.error("Invoiceto Must Be Graterthen InvoiceTo")
        }
        else {
            const filtervalues = invoices.filter((item) => item.PurchaseInvoice <= selectedInvoiceTo.value)
            const allFalse = filtervalues.filter((item) => item.PostStatus !== true).map((item) => {
                return ({
                    id: item._id,
                    inv: item.PurchaseInvoice,
                    date: item.PurchaseInvoiceDate,
                    status: true,
                    Location: item.Location,
                    Store: item.Store,
                    data: item.PurchaseData,
                    Amount: parseInt(item.ValueAfterDiscout)
                })
            })
            const AccountsData = allFalse.map((item) => ({
                VoucherType: "Pr",
                VoucherNumber: `Pr${item.inv}`,
                status: "Post",
                VoucherDate: item.date,
                VoucharData: [
                    {
                        Account: Admin.finishedGoods,
                        Debit: item.data.reduce((sum, row) => sum + (parseFloat(row.GrossAmount) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.PurchaseDiscount,
                        Credit: item.data.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.TradeDiscount,
                        Credit: item.data.reduce((sum, row) => sum + (parseFloat(row.AfterTaxdiscount) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.Gst,
                        Debit: item.data.reduce((sum, row) => sum + (parseFloat(row.Gst) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.AdvanceTax,
                        Debit: item.data.reduce((sum, row) => sum + (parseFloat(row.AdvanceTax) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.Vendor,
                        Credit: item.data.reduce((sum, row) => sum + (parseFloat(row.netAmuntWithAdvnaceTax) || 0), 0) ,
                        store: item.Store,
                    },
                ]
                    .filter(
                        item => (item.Debit ?? 0) !== 0 || (item.Credit ?? 0) !== 0
                    )
            }))
            console.log(AccountsData)
            for (const item of AccountsData) {
                try {
                    const data = await createDataFunction("/Voucher/createSystemVoucher", item)
                    console.log(item)
                } catch (err) {
                    console.log(err)
                }

            }
            for (const item of allFalse) {
                try {
                    const res = await updateDataFunction(`PurchaseInvoice/Changestatus/${item.id}`, item)
                    console.log(res)
                    await dispatch(updateDatePurchaseInvoice(item))
                } catch (err) {
                    return console.log(err)
                }

            }
        }
        setSelectedInvoiceFrom(null)
        setSelectedInvoiceTo(null)
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Post invoice
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Select Purchase Invoice</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Invoice from
                                </label>
                                <Select
                                    options={invoiceOptions}
                                    value={selectedInvoiceFrom}
                                    onChange={setSelectedInvoiceFrom}
                                    placeholder="Search invoices..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            borderRadius: '0.5rem',
                                            borderColor: '#e5e7eb',
                                            '&:hover': { borderColor: '#9ca3af' },
                                            minHeight: '44px'
                                        }),
                                        option: (provided) => ({
                                            ...provided,
                                            padding: '12px 16px',
                                        })
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Invoice to
                                </label>
                                <Select
                                    options={invoiceOptions}
                                    value={selectedInvoiceTo}
                                    onChange={setSelectedInvoiceTo}
                                    placeholder="Search invoices..."
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            borderRadius: '0.5rem',
                                            borderColor: '#e5e7eb',
                                            '&:hover': { borderColor: '#9ca3af' },
                                            minHeight: '44px'
                                        }),
                                        option: (provided) => ({
                                            ...provided,
                                            padding: '12px 16px',
                                        })
                                    }}
                                />
                            </div>


                            {/* Modal Footer */}
                            <div className="flex justify-end space-x-3 pt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default InvoiceSelectionModal;