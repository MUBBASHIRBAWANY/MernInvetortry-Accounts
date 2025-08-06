import AsyncSelect from 'react-select/async';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateDataFunction } from '../../Api/CRUD Functions';
import { useNavigate } from 'react-router-dom';
import { updateDateSaleOrder } from '../../Redux/Reducers/SaleOrderReducer';


const SaleOrderUnPost = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrderFrom, setSelectedOrderFrom] = useState(null);
    const [selectedOrderTo, setSelectedOrderTo] = useState(null)
    const Products = useSelector((state) => state.Product.product);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [submit, setSubmit] = useState(false)
    const Order = useSelector((state) => state.SaleOrder.SaleOrder)

    const loadOrderOptions = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = Order
            .filter((item) =>
                item.Status == "false"&&
                item.SalesOrder.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results

        return filtered.map((item) => ({
            value: item.SaleOrderNumber,
            label: item.SaleOrderNumber
        }));
    };

    let defaultOptions = Order
        .filter((item) =>
            item.Status == "true"
        ).slice(0, 50).map((item) => ({
            value: item.SaleOrderNumber,
            label: item.SaleOrderNumber
        }));;
    console.log(defaultOptions)


    const handleSubmit = async (e) => {
        setSubmit(false)
        e.preventDefault();
        const data = []
        console.log(selectedOrderFrom.value, selectedOrderTo.value);

        const filtervalues = Order.filter(obj => obj.SaleOrderNumber >= selectedOrderFrom.value && obj.SaleOrderNumber <= selectedOrderTo.value)
        console.log(filtervalues)
        const allfalse = filtervalues.filter((item) => item.Status == "true").map((item) => {
            return ({
                SalesOrder: item.SaleOrderNumber,
                Status: false,
                id: item._id

            })
        })
        console.log(allfalse)
        for (const item of allfalse) {
            try {
                const res = await updateDataFunction(`SaleOrder/ChangeStatus/${item.id}`, item)
                dispatch(updateDateSaleOrder(item))
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
                        const notAvalible = `In Inv#${item.SalesOrder} Qty of ${Products.find((item) => item._id == error[0].product).ProductName} Avalibale Qty ${error[0].qty}  you need ${error[0].Req} Boxes`
                        toast.error(notAvalible)
                    }
                }
            }



        }

        setSelectedOrderFrom(null)
        setSelectedOrderTo(null)
        setIsOpen(false);
        setSubmit(true)
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                UnPost Order
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Select Sale Order</h3>
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
                                    Select Order from
                                </label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOrderOptions}
                                    defaultOptions={defaultOptions}
                                    value={selectedOrderFrom}
                                    onChange={setSelectedOrderFrom}
                                    placeholder="Search Order..."
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
                                    Select Order to
                                </label>
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadOrderOptions}
                                    onChange={setSelectedOrderTo}
                                    placeholder="Search Order..."
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

export default SaleOrderUnPost;