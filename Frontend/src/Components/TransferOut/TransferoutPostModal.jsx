import Select from 'react-select';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';
import { updateDateTransferOut } from '../../Redux/Reducers/TransferOutReducer';

const TransferoutPostModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const TransferOut = useSelector((state) => state.TransferOut.TransferOut)



    const invoices = [...TransferOut].sort((a, b) => parseInt(a.TransferCode) - parseInt(b.TransferCode));;
    const invoiceOptions = invoices.filter((item) => item.PostStatus === "false" ||  item.PostStatus === "Draft" ).map((item) => {
        return ({
            value: item.TransferCode,
            label: item.TransferCode
        })
    })

    const handleSubmit = async (e) => {
        console.log("first")
        e.preventDefault();
        console.log("false")

        // Handle form submission

        if (selectedInvoiceFrom.value > selectedInvoiceTo.value) {
            return toast.error("Invoiceto Must Be Graterthen InvoiceTo")
        }

        else {
            const filtervalues = invoices.filter((item) => item.TransferCode <= selectedInvoiceTo.value)
            const allFalse = filtervalues.filter((item) => item.PostStatus === "false" || item.PostStatus === "Draft"  ).map((item) => {
                return ({
                    id: item._id,
                    status: "TransferOut",
                    LocationFrom: item.LocationFrom,
                    StoreFrom: item.StoreFrom,
                    TransferData: item.TransferData,
                    LocationTo: item.LocationTo,
                    StoreTo: item.StoreTo,
                    TransferCode: item.TransferCode,
                    TransferOutDate: item.TransferOutDate,
                    SalesFlowRef: item.SalesFlowRef

                })
            })
            console.log(allFalse)
            for (const item of allFalse) {
                try {
                    const res = await updateDataFunction(`TransferOut/ChangeStatus/${item.id}`, item)
                    console.log(res)
                    await dispatch(updateDateTransferOut(item))
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
                Post Transfer Out
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Select Tranfer Out</h3>
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
                                    Select Tranfer Out from
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
                                    Select Tranfer Out to
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
    )
}

export default TransferoutPostModal