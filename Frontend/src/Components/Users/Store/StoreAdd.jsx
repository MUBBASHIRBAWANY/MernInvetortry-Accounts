import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import { generateNextCodeForCat } from '../../Global/GenrateCode';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { createDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import { useEffect, useState } from 'react';
import Select from 'react-select'


const StoreAdd = () => {
    const navigate = useNavigate()
    const [selectedLocation, setselectedLocation] = useState("")

    const {
        register,
        handleSubmit,
        formState: { errors },

    } = useForm();
    let Location = useSelector((state) => state.Location.Location)
    console.log(Location)
    const LocationDrp = Location?.map((item) => {
        return { value: item._id, label: item.LocationName }
    })

    const onSubmit = async (data) => {
        const code = await getDataFundtion(`/Store/lastCode`)
        console.log(code.data)
        code.data == null ? data.code = generateNextCodeForCat('00') : data.code = generateNextCodeForCat(code.data.code)
        data.Location = selectedLocation
        console.log(data)
        try {
            const res = await createDataFunction('/Store', data)
            console.log(res)
            toast.success("Data Add")
            setTimeout(() => {
                navigate("/Storelist")
            }, 2000);
        } catch (err) {
            toast.error("Some thing went Wrong")

        }
    }
     const UserRihts = useSelector((state) => state.UsersRights.UserRights)
      const pageName = "Add Store"
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
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add Store</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Store Name</label>
                            <input
                                type="text"
                                {...register("StoreName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location </label>
                            <Select onChange={(val) => setselectedLocation(val.value)} options={LocationDrp} />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Add Store
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StoreAdd