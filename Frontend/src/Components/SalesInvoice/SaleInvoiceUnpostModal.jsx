import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';
import { updateDateSalesInvoice } from '../../Redux/Reducers/SalesInvoiceReducer';

const SaleInvoiceUnPostModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const invoices = useSelector((state) => state.SalesInvoice.SalesInvoice)

    const loadInvoiceOptions = async (inputValue) => {
        if (!inputValue) return [];
        const filtered = invoices
            .filter((item) =>
                item.PostStatus !== false &&
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
            item.PostStatus !== false
        ).slice(0, 50).map((item) => ({
            value: item.SalesInvoice,
            label: item.SalesInvoice
        }));;



    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = []
        // Handle form submission
        console.log(selectedInvoiceFrom.value, selectedInvoiceTo.value);
        if (selectedInvoiceFrom.value > selectedInvoiceTo.value) {
            return toast.error("Invoiceto Must Be Graterthen InvoiceTo")
        }
        else {
            const filtervalues = invoices.filter(obj => obj.SalesInvoice >= selectedInvoiceFrom.value && obj.SalesInvoice <= selectedInvoiceTo.value)
            const allfalse = filtervalues.filter((item) => item.PostStatus !== false).map((item) => {
                return ({
                    id: item._id,
                    status: false,
                    VoucherNumber : `Sl${item.SalesInvoice}`
                })
            })
            console.log(allfalse)
            for (const item of allfalse) {
                try {
                    const res = await updateDataFunction(`SaleInvoice/ChangeStatus/${item.id}`, item)
                    dispatch(updateDateSalesInvoice(item))
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
                UnPost invoice
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
                                    defaultOptions={defaultOptions}
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

export default SaleInvoiceUnPostModal;