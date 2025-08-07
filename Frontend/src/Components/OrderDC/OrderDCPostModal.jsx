import Select from 'react-select';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { createDataFunction, updateDataFunction } from '../../Api/CRUD Functions';
import { data, useNavigate } from 'react-router-dom';
import { updateDateOrderDc } from '../../Redux/Reducers/OrderDCReducer';


const OrderDCPostModal = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOrderDcFrom, setSelectedOrderDcFrom] = useState(null);
    const [selectedOrderDcTo, setSelectedOrderDcTo] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const OrderDc = useSelector((state) => state.OrderDc.OrderDc)
    const Admin = useSelector((state) => state.AdminReducer.AdminReducer)
    const TotalProduct = useSelector((state) => state.TotalProducts.TotalProducts)




    const OrderDcOptions = OrderDc.filter((item) => item.PostStatus !== true).map((item) => {
        return ({
            value: item.DcNumber,
            label: item.DcNumber
        })
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("false")

        // Handle form submission
        console.log(selectedOrderDcFrom.value, selectedOrderDcTo.value);

        const filtervalues = OrderDc.filter(obj => obj.DcNumber >= selectedOrderDcFrom.value && obj.DcNumber <= selectedOrderDcTo.value)
        const allFalse = filtervalues.filter((item) => item.Status == "false").map((item) => {
            return ({
                id: item._id,
                inv: item.DcNumber,
                date: item.DcDate,
                status: true,
                Location: item.Location,
                Store: item.Store,
                ProductData: item.DcData,
                CostAccount: Admin.COSTOFSALES,
                FinshedAccount: Admin.finishedGoods,
            })
        })

        const total = allFalse.map((tot) => ({
            id: tot.id,
            DcNum: tot.inv,
            Date: tot.date,
            Location: tot.Location,
            Store: tot.Store,
            status : true,
            CostAccount: Admin.COSTOFSALES,
            FinshedAccount: Admin.finishedGoods,
            ProductData : tot.ProductData,
            data: tot.ProductData.map((item) => ({
                products: item.product,
                inv : tot.inv,
                date : tot.date,
                Order : item.Order,
                amount: (TotalProduct.find((val) => val.ProductName == item.product && val.Location == tot.Location && val.Store == tot.Store).AvgRate * item.Delivered).toFixed(4)
            }))
        }));


console.log(total)

        for (const item of total) {
            try {
                const res = await updateDataFunction(`DcOrder/ChangeStatus/${item.id}`, item)
                console.log(res)
                await dispatch(updateDateOrderDc(item))
            } catch (err) {
                return console.log(err)
            }

        }

        setSelectedOrderDcFrom(null)
        setSelectedOrderDcTo(null)
        setIsOpen(false);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                Post OrderDc
            </button>

            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-semibold text-gray-800">Select  OrderDc</h3>
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
                                    Select OrderDc from
                                </label>
                                <Select
                                    options={OrderDcOptions}
                                    value={selectedOrderDcFrom}
                                    onChange={setSelectedOrderDcFrom}
                                    placeholder="Search OrderDc..."
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
                                    Select OrderDc to
                                </label>
                                <Select
                                    options={OrderDcOptions}
                                    value={selectedOrderDcTo}
                                    onChange={setSelectedOrderDcTo}
                                    placeholder="Search OrderDc..."
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

export default OrderDCPostModal;