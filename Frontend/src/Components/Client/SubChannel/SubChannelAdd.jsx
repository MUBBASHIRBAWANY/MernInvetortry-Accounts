import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'
import { getDataFundtion, createDataFunction } from '../../../Api/CRUD Functions';

const SubChannelAdd = () => {
   const {
            register,
            handleSubmit,
            formState: { errors },
    
        } = useForm();
        const navigate = useNavigate()
        const UserRihts = useSelector((state) => state.UsersRights.UserRights)
        const Channel = useSelector((state) => state.Channel.channel)
        console.log(Channel)
        const [prChannel, setPrChannel ] = useState("")
        const checkAcess = async () => {
            console.log(UserRihts)
            const allowAcess = await UserRihts.find((item) => item == pageName)
            console.log(allowAcess)
            if (!allowAcess) {
                navigate("/")
            }
        }
        
        const onSubmit = async (data) => {
    
            let getChannelByType = await getDataFundtion(`/SubChannel/SubChannelByType/${setPrChannel}`)
            
            getChannelByType.data.length == 0 ? data.code = generateNextCodeForCat(getChannelByType.data.length) : data.code = generateNextCodeForCat(getChannelByType.data.slice(-1)[0].code)
            console.log(data)
            try {
    
                await createDataFunction("/SubChannel", data)
                toast.success("Data Add")
                setTimeout(() => {
                    navigate('/SubChannellist')
                }, 2000);
    
            } catch (err) {
                console.log(err)
            }
    
        }
        const Channeldrp = Channel.map((item) => {
            return { value: item._id, label: `${item.ChanneName} (${item.code})` }
        })
  return (
       <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Category</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Sub Channel Name </label>
                            <input
                                type="text"
                                {...register("SubChanneName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Sub Channel 
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
  )
}

export default SubChannelAdd