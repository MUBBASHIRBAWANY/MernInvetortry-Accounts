import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';
import { updateDateSalesInvoice } from '../../Redux/Reducers/SalesInvoiceReducer';

const SaleInvoicePostModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const Products = useSelector((state) => state.Product.product);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false)
    const invoices = useSelector((state) => state.SalesInvoice.SalesInvoice)
    const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
    const Client = useSelector((state) => state.Client.client)
    const Admin = useSelector((state) => state.AdminReducer.AdminReducer)


    const loadInvoiceOptions = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = invoices
            .filter((item) =>
                item.PostStatus !== true &&
                item.SalesInvoice.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results

        return filtered.map((item) => ({
            value: item.SalesInvoice,
            label: item.SalesInvoice
        }));
    };

    let defaultOptions = invoices
        .filter((item) =>
            item.PostStatus !== true
        ).slice(0, 50).map((item) => ({
            value: item.SalesInvoice,
            label: item.SalesInvoice
        }));;



    const handleSubmit = async (e) => {
        setSubmit(false)
        e.preventDefault();
        const data = []
        console.log(selectedInvoiceFrom.value, selectedInvoiceTo.value);


        const filtervalues = invoices.filter(obj => obj.SalesInvoice >= selectedInvoiceFrom.value && obj.SalesInvoice <= selectedInvoiceTo.value)
        console.log(filtervalues)
        const allTrue = filtervalues.filter((item) => item.PostStatus !== true).map((item) => {
            return ({
                id: item._id,
                status: true,

                AccountsData: [
                    {
                        VoucherType: "SL",
                        VoucherNumber: `Sl${item.SalesInvoice}`,
                        VoucherDate: item.SalesInvoiceDate,
                        status: "Post",
                        VoucharData: [
                            {
                                Account: Accounts.find((Ac) => Ac.AccountCode === Client.find((C) => C._id === item.Client).AccountCode)._id,
                                Debit: (Number(item.TotalAmount) - Number(item.AddAmount || 0) + Number(item.LessAmount || 0)),
                                Store: item.Store,
                            },
                            {
                                Account: Admin.SaleDiscount,
                                Debit: item.SalesData.reduce((sum, row) => sum + (parseFloat(row.Discount) || 0), 0),
                                Store: item.Store,
                            },
                            {
                                Account: Admin.salesRevenue,
                                Credit: item.SalesData.reduce((sum, row) => sum + (parseFloat(row.Discount) || 0), 0) + (Number(item.TotalAmount) - Number(item.AddAmount || 0) + Number(item.LessAmount || 0)),
                                Store: item.Store,
                            },
                            {
                                Account: Accounts.find((Ac) => Ac.AccountCode === Client.find((C) => C._id === item.Client).AccountCode)._id,
                                Debit: Number(item.AddAmount || 0),
                                Store: item.Store,
                            },
                            {
                                Account: item.AddAccount,
                                Credit: Number(item.AddAmount || 0),
                                Store: item.Store,
                            },
                            {
                                Account: Accounts.find((Ac) => Ac.AccountCode === Client.find((C) => C._id === item.Client).AccountCode)._id,
                                Credit: Number(item.LessAmount || 0),
                                Store: item.Store,
                            },
                            {
                                Account: item.LessAccount,
                                Debit: Number(item.LessAmount || 0),
                                Store: item.Store,
                            },
                        ].filter(
                            item => (item.Debit ?? 0) !== 0 || (item.Credit ?? 0) !== 0
                        )

                    }
                ]
            })
        })
        console.log(allTrue)
        for (const item of allTrue) {
            try {
                const res = await updateDataFunction(`SaleInvoice/ChangeStatus/${item.id}`, item)
                dispatch(updateDateSalesInvoice(item))
            } catch (err) {

                const error = err?.response?.data?.errors
                if (error) {
                    console.log(error)
                    try {
                        const notAvalible = `this product not avalibale ${Products.find((item) => item._id == error[0]).ProductName}`
                        toast.error(notAvalible)
                    }
                    catch {
                        console.log(error)
                        const notAvalible = `In Inv#${item.SalesInvoice} Qty of ${Products.find((item) => item._id == error[0].product).ProductName} Avalibale Qty ${error[0].qty}  you need ${error[0].Req} Boxes`
                        toast.error(notAvalible)
                    }
                }
            }



        }

        setSelectedInvoiceFrom(null)
        setSelectedInvoiceTo(null)
        setIsOpen(false);
        setSubmit(true)
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
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Select Invoice from
                                </label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadInvoiceOptions}
                                    defaultOptions={defaultOptions}
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
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadInvoiceOptions}
                                    onChange={setSelectedInvoiceTo}
                                    placeholder="Search invoices..."
                                    defaultOptions={defaultOptions}
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
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    disabled={submit}
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

export default SaleInvoicePostModal;