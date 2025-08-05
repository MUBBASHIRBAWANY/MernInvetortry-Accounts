import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCode, generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Select from 'react-select'
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const RegionAdd = () => {
    const navigate = useNavigate()
    const Zone = useSelector((state) => state.Zone.zone)
    const [selectZone, setSelectZone] = useState('')
    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();
    const ZoneDrp = Zone.map((item) => ({
        value: item._id,
        label: item.ZoneName
    }))

    const onSubmit = async (data) => {
        const code = await getDataFundtion(`/Region/lastCode`)
        console.log(code.data)
        code.data === null ? data.code = generateNextCodeForCat('00') : data.code = generateNextCodeForCat(code.data.code)
        data.Zone = selectZone
        console.log(data)

        try {
            const res = await createDataFunction('/Region', data)
            console.log(res)
            toast.success("Data Add")
            setTimeout(() => {
                navigate("/Regionlist")
            }, 2000);
        } catch (err) {
            toast.success("Some thing went Wrong")

        }
    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Region</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Region Name</label>
                            <input
                                type="text"
                                {...register("RegionName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm md:text-base text-gray-700 font-semibold mb-2">Zone</label>
                            <Select onChange={(v) => setSelectZone(v.value)} options={ZoneDrp} placeholder="select zone" />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Region
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegionAdd