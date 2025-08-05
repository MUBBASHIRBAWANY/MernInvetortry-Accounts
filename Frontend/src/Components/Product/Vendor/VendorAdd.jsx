import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const VendorAdd = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate()
  const pageName = "VenderAdd"
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const Store = useSelector((state) => state.Store.Store)
  const [activeTab, setActiveTab] = useState('basic');
  const [changeStore, setChangeStore] = useState("")
  const [selectStore, setSelectStore] = useState("")
  const [vendorAccouts, serVendorAccouts] = useState('')
  const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
  console.log(Account)

  const filteredAccount = Account.filter((item) => item.AccountCode.length === 5)
  const VendorAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)



  const result = [];
  for (let i = VendorAccountNumber.VendorFrom; i <= VendorAccountNumber.VendorFrom; i++) {
    result.push(i.toString().padStart(5, '0'));
  }


  const venodrSeries = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))

  const onSubmit = async (data) => {


    data.Stage3 = vendorAccouts.value
    data.Stage = "4"
    data.AccountName = data.VendorName
    data.masterCode = Account.find((item) => item._id == vendorAccouts.value).AccountCode
    data.Stage1 = Account.find((item) => item._id == vendorAccouts.value).Stage1
    data.Stage2 = Account.find((item) => item._id == vendorAccouts.value).Stage2
    const lsstvedor = await getDataFundtion('/vendor/lastVendor')
    console.log(lsstvedor)
    if (lsstvedor.data == null) {
      data.code = "01"
      data.Store = selectStore
      console.log(data)
      try {
        const createAccout = await createDataFunction('/ChartofAccounts', data)
        data.AccountCode = createAccout.data.AccountCode 
        const res = await createDataFunction("/vendor", data)
        console.log(res)
        toast.success("vendor Add Successfully")
        setTimeout(() => {
           navigate("/VendorList")
        }, 1000)

      } catch (err) {
        toast.error("Some Thing Went Wrong")
      }

    } else {
      try {
        data.code = generateNextCode(lsstvedor.data.code)
        console.log(data)
        data.Store = selectStore
        const createAccout = await createDataFunction('/ChartofAccounts', data)
        data.AccountCode = createAccout.data.AccountCode 
        const res = await createDataFunction("/vendor", data)
        toast.success("Data Add")
        setTimeout(() => {
           navigate("/VendorList")
        }, 2000);
        console.log(data)
      } catch (err) {
        toast.error("Some Thing Went Wrong")
      }
    }

  }

  const VedorSeriesDrp = venodrSeries.map((item) => ({
    value: item._id,
    label: `${item.AccountCode} ${item.AccountName}`
  }))

  const StoreChnge = (id) => {
    setChangeStore(id)
    const values = (id || []).map(option => option.value);
    setSelectStore(values)
  }
  const checkAcess = async () => {
    const allowAcess = await UserRihts.find((item) => item == pageName)
    console.log(allowAcess)
    if (!allowAcess) {
      navigate("/")
    }
  }

  const AllStore = Store.map((item) => {
    return {
      value: item._id,
      label: item.StoreName
    }
  })
  // useEffect(() => {
  //   checkAcess()
  // }, [])
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Add Vendor</h1>
        <ToastContainer />

        <div className="mb-4">
          <div className="flex border-b border-gray-200">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('basic')}
              >
                Basic Info
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'financial'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('financial')}
              >
                Financial Details
              </button>
              <button
                type="button"
                className={`py-2 px-4 font-medium text-sm border-b-2 ${activeTab === 'discounts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                onClick={() => setActiveTab('discounts')}
              >
                Discounts
              </button>
            </div>
          </div>
        </div>

        <form className="bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Vendor Series Account</label>
                <Select options={VedorSeriesDrp} onChange={(e) => serVendorAccouts(e)} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Short Code</label>
                <input
                  type="text"
                  maxLength={5}
                  minLength={5}
                  {...register("ShortCode")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Vendor Name</label>
                <input
                  type="text"
                  {...register("VendorName")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">sales Flow Ref</label>
                <input
                  type="text"
                  {...register("salesFlowRef")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone</label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Address</label>
                <input
                  type="text"
                  {...register("Address")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">NTN</label>
                <input
                  type="text"
                  {...register("NTN")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">STN</label>
                <input
                  type="text"
                  {...register("STN")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Fax</label>
                <input
                  type="text"
                  {...register("Fax")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">WebSite</label>
                <input
                  type="text"
                  {...register("WebSite")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Contact Person</label>
                <input
                  type="text"
                  {...register("ContactPerson")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Purchase Date</label>
                <input
                  type="Date"
                  {...register("PurchaseDate")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2"> Vendor Store </label>
                <Select isMulti value={changeStore} options={AllStore} onChange={(val) => StoreChnge(val)} />
              </div>
            </div>
          )}

          {/* Financial Details Tab */}
          {activeTab === 'financial' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Zone A/c</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Department</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Transport</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Price List</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Transport</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Dep Exp A/c</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Acc Dep Exp A/c</label>
                <Select />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Dep %</label>
                <input
                  type="text"
                  {...register("DepPercent")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* Discounts Tab */}
          {activeTab === 'discounts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Targeted Discount Percent</label>
                <input
                  type="text"
                  {...register("TargetedDiscountPercent")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Targeted Discount Amount</label>
                <input
                  type="text"
                  {...register("TargetedDiscount")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cash Discount Percent</label>
                <input
                  type="text"
                  {...register("CashDiscountPercent")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Cash Discount Amount</label>
                <input
                  type="text"
                  {...register("CashDiscountAmount")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Advance Discount Amount</label>
                <input
                  type="text"
                  {...register("AdvanceDiscountAmount")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Advance Discount %</label>
                <input
                  type="text"
                  {...register("AdvanceDiscountPercent")}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            {activeTab !== 'basic' && (
              <button
                type="button"
                className="mr-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={() => setActiveTab(activeTab === 'financial' ? 'basic' : 'financial')}
              >
                Previous
              </button>
            )}
            {activeTab !== 'discounts' && (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                onClick={() => setActiveTab(activeTab === 'basic' ? 'financial' : 'discounts')}
              >
                Next
              </button>
            )}
            {activeTab === 'discounts' && (
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Vendor
              </button>
            )}
          </div>
        </form>
      </div>
    </div>

  )
}

export default VendorAdd

// <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
//             <button
//               type="submit"
//               className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
//             >
//               Add Vendor
//             </button>
//           </div>