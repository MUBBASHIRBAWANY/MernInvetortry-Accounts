import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion, updateDataFunction } from '../../../Api/CRUD Functions';

const ChqBookEdit = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,

    } = useForm();

    const navigate = useNavigate()
    const [Bank, setBank] = useState("");
    const BankAccountNumber = useSelector((state) => state.AdminReducer.AdminReducer)
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts);
    const ChqBook = useSelector((state) => state.ChqBook.ChqBook)
    
    const filteredAccount = Account.filter((item) => item.AccountCode.length > 5)
    const { id } = useParams()
    const result = [];
    for (let i = BankAccountNumber.BankAccountFrom; i <= BankAccountNumber.BankAccountTo; i++) {
        result.push(i.toString().padStart(5, '0')); // Adjust to 5 digits
    }
    const AllBank = filteredAccount.filter((item) => result.some(prefix => item.AccountCode.startsWith(prefix)))
    const BankAccount = AllBank.map((item) => ({
        label: `${item.AccountCode} ${item.AccountName}`,
        value: item._id
    }));;

    const getData = () => {
        const data = ChqBook.find((item) => item._id == id)
        setBank(data.Bank)
        reset({
            Prefix: data.Prefix,
            CheuquesStart: data.CheuquesStart,
            CheuquesEnd: data.CheuquesEnd
        })
    }

    useEffect(() => {
        getData()
    }, [])
    const onSubmit = async (data) => {
        data.Bank = Bank
        console.log(data)
        try {
            await updateDataFunction(`/ChqBook/update/${id}`, data)
            toast.success("ChqBook Added Successfully")
            setTimeout(() => {
                navigate('/ChqBookList')
            }, 2000);
        } catch (err) {
            console.log(err)
            toast.error("Failed to add ChqBook")
        }
    }


    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add ChqBook</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Bank </label>
                            <Select
                                menuPortalTarget={document.body}
                                onChange={(selectedOption) => setBank(selectedOption.value)}
                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                options={BankAccount}
                                value={Bank ? {
                                    value: `${Bank}`,
                                    label: `${Account.find((c) => c._id === Bank)?.AccountCode} ${Account.find((c) => c._id === Bank)?.AccountName}`
                                } : null}
                                className="basic-single text-sm"
                                classNamePrefix="select"
                                isSearchable
                                placeholder="Select credit account..."
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Prefix</label>
                            <input
                                type="text"
                                {...register("Prefix")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Chq No From </label>
                            <input
                                type="text"
                                {...register("CheuquesStart")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Chq No To</label>
                            <input
                                type="text"
                                {...register("CheuquesEnd")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add ChqBook
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChqBookEdit
