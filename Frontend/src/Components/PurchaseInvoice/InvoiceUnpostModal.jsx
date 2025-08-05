import Select from 'react-select';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from "../../Redux/Reducers/PurchaseInvoiceReducer"

const InvoiceUnpostModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const navigate = useNavigate()
    const Products = useSelector((state) => state.Product.product);
    const invoices = useSelector((state) => state.PurchaseInvoice.PurchaseInvoice)
    const dispatch = useDispatch()

    const invoiceOptions = invoices.filter((item) => item.PostStatus !== false).map((item) => {
        return ({
            value: item.PurchaseInvoice,
            label: item.PurchaseInvoice
        }
        )
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = []
        // Handle form submission
        console.log(selectedInvoiceFrom.value, selectedInvoiceTo.value);
        if (selectedInvoiceFrom.value > selectedInvoiceTo.value) {
            return toast.error("Invoiceto Must Be Graterthen InvoiceTo")
        }
        else {
            console.log(invoices)
            const filtervalues = invoices.filter(obj => obj.PurchaseInvoice >= selectedInvoiceFrom.value && obj.PurchaseInvoice <= selectedInvoiceTo.value)
            console.log(filtervalues)
            const allFalse = filtervalues.filter((item) => item.PostStatus !== false).map((item) => {
                return ({
                    PurchaseInvoice: item.PurchaseInvoice,
                    id: item._id,
                    status: false,
                    Location: item.Location,
                    Store: item.Store,
                    data: item.PurchaseData
                })
            })
            console.log(allFalse)
            for (const item of allFalse) {
                try {
                    const res = await updateDataFunction(`PurchaseInvoice/Changestatus/${item.id}`, item)
                    console.log(res)
                    const deletevoucher = await deleteDataFunction(`/Voucher/deleteVoucher/Pr${item.PurchaseInvoice}`)
                    console.log(deletevoucher)
                    await dispatch(updateDatePurchaseInvoice(item))

                } catch (err) {

                    const error = err?.response?.data?.errors
                    if (error) {
                        console.log(error)
                        try {
                            console.log(error[0][0])
                            const notAvalible = `${Products.find((item) => item._id == error[0][0]).ProductName} not found at specified on your location`
                            toast.error(notAvalible)
                        }
                        catch {
                            console.log(error)
                            const notAvalible = `In Inv#${item.PurchaseInvoice} Qty of ${Products.find((item) => item._id == error[0].product).ProductName} Avalibale Qty ${error[0].available}  you need ${error[0].tryingToDeduct} Boxes`
                            toast.error(notAvalible)
                        }
                    }
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
                UnPost Invoice
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

export default InvoiceUnpostModal;