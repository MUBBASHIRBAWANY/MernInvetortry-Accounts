// Genrallager.jsx
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import GenrallagerPopup from './GenrallagerPopup';
import ReactDOM from 'react-dom/client';
import { getDataFundtion } from '../../../../Api/CRUD Functions';
import AsyncSelect from 'react-select/async';
import { toast, ToastContainer } from 'react-toastify';


const Genrallager = ({
    handleLocationChange,
    locationOptions,
    storeOptions,
    isLoading
}) => {

    const status = [
        { label: "Post", value: "Post" },
        { label: "UnPost", value: "UnPost" },
        { label: "Both", value: "Both" }
    ];
    const [isOpen, SetisOpen,] = useState(true)
    const [qtyType, setQtyType,] = useState('Box')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [location, setLocation] = useState([])
    const [storeforDrp, setStoreForDrp] = useState([])
    const [selectedLocation, setSelectedLocation] = useState([])
    const loginVendor = useSelector((state) => state.LoginerReducer.userDetail)
    const [slectedStore, setSlectedStore] = useState('')
    const [Store, setStore] = useState('')
    const [Accounts, setAccounts] = useState("")
    const [dataStatus, setDataStatus] = useState('')
    const [stratAccounts, setStratAccounts] = useState([])
    const [SelectedAccount, setSelectedAccount] = useState('')


    const loadInvoiceOptions = async (inputValue) => {
        if (!inputValue) return [];

        const filtered = Accounts
            .filter((item) =>
                item.AccountName.toLowerCase().includes(inputValue.toLowerCase()) || item.AccountCode.toLowerCase().includes(inputValue.toLowerCase())
            )
            .slice(0, 50); // limit to first 50 results

        return filtered.map((item) => ({
            label: `${item.AccountName} ${item.AccountCode}`,
            value: item._id

        }));
    };

    console.log(Accounts)

    const getProduct = async () => {

        const Location = await getDataFundtion("/Location")
        const Store = await getDataFundtion("/Store")
        const Account = await getDataFundtion("/chartofAccounts/Stage4")
        setAccounts(Account.data)
        setStoreForDrp(Store.data)
        
        setSelectedLocation(loginVendor.Location)
        console.log(storeforDrp.push(0))
        const allstore = Store.data.map((item) => ({
            label: item.StoreName,
            value: item._id,
        }));
        const headOffice = [{
            label: "Head Office",
            value: "0",
        }]
        const totalStore = [0]
        const allstoreValue = loginVendor.Store.map((item) => totalStore.push(item))
        setSlectedStore(totalStore)
        setStore(headOffice.concat(allstore))

console.log(loginVendor)

        const StartingAccounts = Account?.data?.slice(0, 50)?.map((item) => ({
            label: `${item.AccountName} ${item.AccountCode}`,
            value: item._id
        }));;
        setStratAccounts(StartingAccounts)

    }
    console.log(slectedStore)
    useEffect(() => {
        getProduct()
    }, [])
    const openPopupTab = async () => {

        if (startDate === "" || endDate === "") {
            return toast.error("Please enter start & end date")
        }
        const popup = window.open('', '', 'width=1200,height=800,left=100,top=50');
        if (!popup) return alert('Popup blocked');

        popup.document.title = 'Inventory Report';
        popup.document.body.innerHTML = `<div id="popup-root">
    
    </div>`;
        const submitData = {
            startDate: startDate,
            endDate: endDate,
            store: slectedStore,
            Account: SelectedAccount,
            AcName : Accounts.find((item)=> item._id == SelectedAccount).AccountName,
            AcCode : Accounts.find((item)=> item._id == SelectedAccount).AccountCode,
            PrintedBy : `${loginVendor.firstname}`
        }
        const interval = setInterval(() => {
            const mountNode = popup.document.getElementById('popup-root');
            if (mountNode) {
                clearInterval(interval);
                const root = ReactDOM.createRoot(mountNode);
                root.render(<GenrallagerPopup data={submitData} value={value} />);
            }
        }, 100);

        setValue(2)
    }

    const [showPopup, setShowPopup] = useState(false);
    const [value, setValue] = useState(1)

    return (
        <>
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md mx-[30%] my-[5%]">
                <ToastContainer />
                <div className="grid grid-cols-5 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Date From</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Date To</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full mt-1 p-2 border rounded-md"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium">Account</label>
                        <AsyncSelect
                            menuPortalTarget={document.body}
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            cacheOptions
                            onChange={(selectedOption) =>
                                setSelectedAccount(selectedOption.value)
                            }
                            loadOptions={loadInvoiceOptions}
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Select Account"
                            defaultOptions={stratAccounts}
                        />

                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-medium">Store</label>
                        <Select
                            isMulti
                            options={Store}
                            onChange={(options) => {
                                const selectedValues = options.map((opt) => opt.value);
                                setSlectedStore(selectedValues);
                            }}
                            className="basic-single"
                            classNamePrefix="select"
                            isSearchable
                            placeholder="Select Store"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <button
                            onClick={() => openPopupTab()}
                            disabled={isLoading}
                            className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {isLoading ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </div>

            </div>
        </>
    )

};

export default Genrallager;