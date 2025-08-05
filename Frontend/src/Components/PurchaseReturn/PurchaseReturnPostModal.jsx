import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';
import { updateDatePurchaseReturn } from '../../Redux/Reducers/PurchaseReturnReducer';

const PurchaseReturnReturnPost = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const Products = useSelector((state) => state.Product.product);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false)
    const invoices = useSelector((state) => state.PurchaseReturn.PurchaseReturn)
    const Admin = useSelector((state) => state.AdminReducer.AdminReducer)

    const loadInvoiceOptions = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = invoices
            .filter((item) =>
                item.PostStatus !== true &&
                item.PurchaseReturn.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results

        return filtered.map((item) => ({
            value: item.PurchaseReturn,
            label: item.PurchaseReturn
        }));
        console.log(filtered)
    };
    let defaultOptions = invoices
        .filter((item) =>
            item.PostStatus !== true
        ).slice(0, 50).map((item) => ({
            value: item.PurchaseReturn,
            label: item.PurchaseReturn
        }));;



    const handleSubmit = async (e) => {

        e.preventDefault();
        const data = []
        console.log(selectedInvoiceFrom.value, selectedInvoiceTo.value);
        const filtervalues = invoices.filter(obj => obj.PurchaseReturn >= selectedInvoiceFrom.value && obj.PurchaseReturn <= selectedInvoiceTo.value)
        console.log(filtervalues)
        const allTrue = filtervalues.filter((item) => item.PostStatus !== true).map((item) => {
            return ({
                PurchaseReturn: item.PurchaseReturn,
                Store: item.Store,
                Location: item.Location,
                id: item._id,
                status: true,
                date: item.PurchaseReturnDate,
                returnData: item.PurchaseReturnData,
            })
        })
        const accountsData = allTrue.map((item) => (
            {
                VoucherType: "Prr",
                VoucherNumber: `Prr${item.PurchaseReturn}`,
                status: "Post",
                VoucherDate: item.date,
                VoucharData: [
                    {
                        Account: Admin.Vendor,
                        Debit: item.returnData.reduce((sum, row) => sum + (parseFloat(row.NetAmountWintAdvanceTax) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.finishedGoods,
                        Credit: item.returnData.reduce((sum, row) => sum + (parseFloat(row.GrossAmount) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.PurchaseDiscount,
                        Debit: item.returnData.reduce((sum, row) => sum + (parseFloat(row.discount) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.TradeDiscount,
                        Debit: item.returnData.reduce((sum, row) => sum + (parseFloat(row.AfterTaxdiscount) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.Gst,
                        Credit: item.returnData.reduce((sum, row) => sum + (parseFloat(row.Gst) || 0), 0),
                        store: item.Store,
                    },
                    {
                        Account: Admin.AdvanceTax,
                        Credit: item.returnData.reduce((sum, row) => sum + (parseFloat(row.AdvanceTax) || 0), 0),
                        store: item.Store,
                    },
                ]
                    .filter(
                        item => (item.Debit ?? 0) !== 0 || (item.Credit ?? 0) !== 0
                    )
            }))

        console.log(accountsData)
        for (const item of accountsData) {
            try {
                const data = await createDataFunction("/Voucher/createSystemVoucher", item)
                console.log(item)
            } catch (err) {
                console.log(err)
            }
        }
        for (const item of allTrue) {
            console.log(allTrue)
            try {
                const res = await updateDataFunction(`/PurchaseReturn/Changestatus/${item.id}`, item)
                console.log(res)
                dispatch(updateDatePurchaseReturn(item))
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
                        const notAvalible = `In Inv#${item.PurchaseReturn} Qty of ${Products.find((item) => item._id == error[0]?.product)?.ProductName} Avalibale Qty ${error[0]?.available}  you need ${error[0]?.tryingToSell} Boxes`
                        toast.error(notAvalible)
                    }
                }
            }
            setSubmit(false)


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
                Post Return
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
                                    isDisable={submit === true ? true : false}
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

export default PurchaseReturnReturnPost;