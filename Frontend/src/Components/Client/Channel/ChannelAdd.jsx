import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import { getDataFundtion, createDataFunction } from '../../../Api/CRUD Functions';

const ChannelAdd = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();
    const navigate = useNavigate()
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const checkAcess = async () => {
        console.log(UserRihts)
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
            navigate("/")
        }
    }

    const onSubmit = async (data) => {
        const lastCode = await getDataFundtion('/Channel/lastcode')
        lastCode.data == null ? data.code = generateNextCode("01") : data.code = generateNextCode(lastCode.data.code)
        console.log(data)
        try {
            await createDataFunction("/Channel", data)
            toast.success("Data Add")
            setTimeout(() => {
                navigate('/Channellist')
            }, 2000);

        } catch (err) {
            console.log(err)
        }

    }
   
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Category</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Channel Name </label>
                            <input
                                type="text"
                                {...register("ChanneName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2"> Channel Type </label>
                            <select
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                {...register("ChanneType")}>
                                <option value="1">Whole Saller</option>
                                <option value="2">Retailer</option>
                            </select>
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                           <button type='submit' className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                Add Channel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default ChannelAdd