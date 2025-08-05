import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AsyncSelect from 'react-select/async';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createDataFunction } from '../../../../Api/CRUD Functions';



const AccountOpeningBalanceAdd = () => {
  const navigate = useNavigate();
  const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
  const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    console.log(filteredAccount)
  const [tableData, setTableData] = useState([]);
  const loadAccounts = async (inputValue) => {
    if (!inputValue) return [];

    const filtered = filteredAccount
      .filter((item) =>
        item.AccountName.toLowerCase().includes(inputValue.toLowerCase()) || item.AccountCode.toLowerCase().includes(inputValue.toLowerCase())
      )
      .slice(0, 50);

    return filtered.map((item) => ({
      label: `${item.AccountCode} ${item.AccountName}`,
      value: item._id
    }));
  }
  const startingAccount = filteredAccount.slice(0, 50).map((item) => ({
    label: `${item.AccountCode} ${item.AccountName}`,
    value: item._id
  }));;

  const { register, handleSubmit, formState: { errors } } = useForm();

  const addNewRow = () => {
    setTableData([...tableData, {
      id: Date.now(),
      Account: '',
      Debit: 0,
      Credit: 0,
    }]);
  };

  const removeRow = (id) => {
    setTableData(tableData.filter(row => row.id !== id));
  };

  const handleCellChange = (id, field, value) => {
console.log(Account)
    setTableData(tableData.map(row => {
      if (row.id === id) {

        const updatedRow = { ...row, [field]: value };
        const checking = tableData.find((item) => item.id == id)
        if (field == "Account") {
          updatedRow.Account = value.value
          if (checking.Account != value) {
            updatedRow.Debit = 0
            updatedRow.Credit = 0
          }
        }
        if (updatedRow.Account == "") {
          updatedRow.Debit = 0
          updatedRow.Credit = 0
        }


        if (field == "Account") {
          updatedRow.Debit = 0
          updatedRow.Credit = 0
        }
        if (field == "Debit") {
          updatedRow.Debit = value
          updatedRow.Credit = 0
        }
        if (field == "Credit") {
          updatedRow.Credit = value
          updatedRow.Debit = 0
        }

        return updatedRow;
      }
      return row;
    }));
  };
  const TotalDebit = tableData.reduce((sum, row) => sum + (parseFloat(row.Debit) || 0), 0);
  const TotalCredit = tableData.reduce((sum, row) => sum + (parseFloat(row.Credit) || 0), 0);


  const onSubmit = async (data) => {
    data.AccountsData = tableData
    data.Status = "false"
    console.log(data)
    try {
      const res = await createDataFunction("/AccountOpening", data)
      console.log(res)
      toast.success("Data Add")
      setTimeout(() => {
        navigate("/AccountOpeninigBalance")
      }, 2000)

    } catch (err) {
      console.log(err)
      toast.error("some thing went wrong")
    }
  }

  return (
    <div className="p-4  ">
      <ToastContainer />
      <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800 mb-6">Account Opening</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 md:p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year From </label>
            <input
              type="date"
              {...register("DateStart", { required: true })}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Year To</label>
            <input
              type="date"
              {...register("DateEnd", { required: true })}
              className="w-full px-3 py-2 text-sm md:text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

        </div>

        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 min-w-[200px]">Account</th>
                <th className="border p-2">Debit</th>
                <th className="border p-2">Credit</th>
                <th className="border p-2">Action</th>

              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <AsyncSelect
                      menuPortalTarget={document.body}
                      onChange={(selectedOption) =>
                        handleCellChange(row.id, 'Account', selectedOption || '')
                      }
                      loadOptions={loadAccounts}
                      styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                      defaultOptions={startingAccount}
                      value={row.Account ? {
                        value: `${row.Account} ${console.log(row)}`,
                        label: `${Account.find((c) => c._id === row.Account)?.AccountCode} ${Account.find((c) => c._id === row.Account)?.AccountName}`
                      } : null}
                      className="basic-single text-sm"
                      classNamePrefix="select"
                      isSearchable
                      placeholder="Select customer..."
                    />
                  </td>

                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.Debit}
                      onChange={(e) => handleCellChange(row.id, 'Debit', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={row.Credit}
                      onChange={(e) => handleCellChange(row.id, 'Credit', e.target.value)}
                      className="w-full p-1 text-xs md:text-sm border rounded"
                    />
                  </td>
                  <td className="border p-2">
                    <button
                      type="button"
                      onClick={() => removeRow(row.id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs md:text-sm rounded hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            {tableData.length !== 0 && (
              <tfoot>
                <tr className="bg-gray-100 font-semibold">
                  <td className="border p-2"></td>
                  <td className="border p-2 hidden md:table-cell">{TotalDebit}</td>
                  <td className="border p-2 hidden md:table-cell">{TotalCredit}</td>
                  <td className="border p-2"></td>

                </tr>
              </tfoot>

            )}
          </table>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <button
            type="button"
            onClick={addNewRow}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm md:text-base"
          >
            Add Row
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm md:text-base"
          >
            Create Opening Balance
          </button>
        </div>
      </form>
    </div>
  )
}

export default AccountOpeningBalanceAdd