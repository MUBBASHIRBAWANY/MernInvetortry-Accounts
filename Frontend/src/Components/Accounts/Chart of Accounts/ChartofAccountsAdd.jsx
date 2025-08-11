import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import ChartofAccountsTreeView from './ChartofAccountsView';



// Build tree structure


const ChartofAccountsAdd = () => {
    const navigate = useNavigate()
    const Accounts = useSelector((state) => state.ChartofAccounts.ChartofAccounts)
    const [stage1, setStage1] = useState('')
    const [stage2, setStage2] = useState('')
    const [stage3, setStage3] = useState('')
    const stage1Accounts = Accounts.filter((item) => item.AccountCode.length == 1)
        .map((Ac) => {
            return ({
                label: Ac.AccountName,
                value: Ac._id
            })

        })
    const stage2Accounts = Accounts.filter((item) => item.AccountCode.length == 3)
        .map((Ac) => {
            return ({
                label: Ac.AccountName,
                value: Ac._id
            })

        })

    const stage3Accounts = Accounts.filter((item) => item.AccountCode.length == 5)
        .map((Ac) => {
            return ({
                label: Ac.AccountName,
                value: Ac._id
            })
        })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },

    } = useForm();
    const stage = Number(watch("Stage", 1))
    console.log(stage);

  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const pageName = "Add Chart of Accounts"
  const checkAcess = async () => {
    const allowAcess = await UserRihts.find((item) => item == pageName)
    console.log(allowAcess)
    if (!allowAcess) {
      navigate("/")
    }
  }

  useEffect(() => {
    checkAcess()
  }, [])


    const onSubmit = async (data) => {
        console.log(data)
        if (data.Stage == "1") {
            try {
                const res = await createDataFunction("/ChartofAccounts", data)
                console.log(res)
                navigate('/ChartofAccounts')
            } catch {
                toast.error("Some thing went gone wrong")
            }

        }
        else if (data.Stage == "2") {
            data.Stage1 = stage1
            data.masterCode = Accounts.find((item) => item._id == stage1).AccountCode
            try {
                const res = await createDataFunction("/ChartofAccounts", data)
                console.log(res)
                navigate('/ChartofAccounts')
            } catch {
                toast.error("Some thing went gone wrong")
            }
        }
        else if (data.Stage == "3") {
            data.Stage2 = stage2
            data.masterCode = Accounts.find((item) => item._id == stage2).AccountCode
            data.Stage1 = Accounts.find((item) => item._id == stage2).Stage1

            try {
                const res = await createDataFunction("/ChartofAccounts", data)
                console.log(res)
                navigate('/ChartofAccounts')
            } catch {
                toast.error("Some thing went gone wrong")
            }
        }
        else if (data.Stage == "4") {
            data.Stage3 = stage3
            data.masterCode = Accounts.find((item) => item._id == stage3).AccountCode
            data.Stage1 = Accounts.find((item) => item._id == stage3).Stage1
            data.Stage2 = Accounts.find((item) => item._id == stage3).Stage2
            try {
                const res = await createDataFunction("/ChartofAccounts", data)
                console.log(res)
                navigate('/ChartofAccounts')

            } catch {
                toast.error("Some thing went gone wrong")
            }
        }

    }
    return (
        <div>
            <div >
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Chart of Accounts Add</h1>
                <ToastContainer />
                <div className=' w-full'>
                    <div>
                        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2"> Stage </label>
                                <select
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    {...register("Stage")}
                                >
                                    <option value="1">Stage 1</option>
                                    <option value="2">Stage 2</option>
                                    <option value="3">Stage 3</option>
                                    <option value="4">Stage 4</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">Account Name</label>
                                <input
                                    type="text"
                                    {...register("AccountName")}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div style={{ display: stage === 2 ? "block" : "none" }}>
                                {stage === 2 ? (
                                    <>
                                        <label className="block text-gray-700 font-semibold mb-2">Stage 1</label>
                                        <Select options={stage1Accounts} onChange={(e) => setStage1(e.value)} />
                                    </>
                                ) : null}
                            </div>
                            <div style={{ display: stage === 3 ? "block" : "none" }}>
                                {stage === 3 ? (
                                    <>
                                        <label className="block text-gray-700 font-semibold mb-2">Stage 2</label>
                                        <Select options={stage2Accounts} onChange={(e) => setStage2(e.value)} />
                                    </>
                                ) : null}
                            </div>
                            <div style={{ display: stage === 4 ? "block" : "none" }}>
                                {stage === 4 ? (
                                    <>
                                        <label className="block text-gray-700 font-semibold mb-2">Stage 3</label>
                                        <Select options={stage3Accounts} onChange={(e) => setStage3(e.value)} />
                                    </>
                                ) : null}
                            </div>
                            <div className="col-span-5 md:col-span-5 lg:col-span-5 flex justify-end">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    Add Chart of Accounts
                                </button>
                            </div>
                        </form>
                    </div>
                    <ChartofAccountsTreeView />


                </div>
            </div>
        </div>
    )
}

export default ChartofAccountsAdd