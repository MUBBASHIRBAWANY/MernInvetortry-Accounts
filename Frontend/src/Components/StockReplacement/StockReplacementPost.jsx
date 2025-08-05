import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDatePurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';
import { updateDateSalesInvoice } from '../../Redux/Reducers/SalesInvoiceReducer';
import Select from 'react-select';
import { updateStockReplacementStatus } from '../../Redux/Reducers/StockReplacement';


const StockReplacementPost = () => {
     const [isOpen, setIsOpen] = useState(false);
    const [selectedInvoiceFrom, setSelectedInvoiceFrom] = useState(null);
    const [selectedInvoiceTo, setSelectedInvoiceTo] = useState(null)
    const Products = useSelector((state) => state.Product.product);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false)
    const StockReplacement = useSelector((state) => state.StockReplacement.StockReplacement)
   console.log(StockReplacement)
     const allTrue = StockReplacement.filter((item) => item.PostStatus !== true).sort((a, b) => a.ReplacementNumber - b.ReplacementNumber)
     const  StockReplacementOption = allTrue.map((item)=>{
        return ({
            value : item.ReplacementNumber,
            label : item.ReplacementNumber
        })
     })
console.log(allTrue)
    const handleSubmit = async (e) => {
        setSubmit(false)
        e.preventDefault();
        const data = []
        console.log(selectedInvoiceFrom.value, selectedInvoiceTo.value);
        if (selectedInvoiceFrom.value > selectedInvoiceTo.value) {
            return toast.error("Invoiceto Must Be Graterthen InvoiceTo")
        }
        else {
            //obj => obj.SalesInvoice >= selectedInvoiceFrom.value && obj.SalesInvoice <= selectedInvoiceTo.value
            const filtervalues = StockReplacement.filter((item) => item.ReplacementNumber >= selectedInvoiceFrom.value && item.ReplacementNumber <= selectedInvoiceTo.value && item.PostStatus !== true)
                .map((d) => {
                return({
                    status : true,
                    ReplacementData:  d.ReplacementData,
                    Store: d.Store,
                    Location : d.Location,
                    id : d._id

                })
            })
            console.log(filtervalues)
            for (const item of filtervalues) {
                try {
                    console.log(item)
             const res = await updateDataFunction(`/StockReplacement/ChangeStatus/${item.id}`, item)
                dispatch(updateStockReplacementStatus({
                    id : item._id,
                    status : true
                }))
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
                            
                        }
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
                                <Select
                                     options={StockReplacementOption}
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
                                    options={StockReplacementOption}
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
  )
}

export default StockReplacementPost