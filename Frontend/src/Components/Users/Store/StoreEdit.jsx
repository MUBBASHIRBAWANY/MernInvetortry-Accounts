import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDataFunction } from '../../../Api/CRUD Functions';
import Select from 'react-select'

const StoreEdit = () => {
    const { id } = useParams()
    const locationEdit = useSelector((state) => state.Store.Store)
    const location = useSelector((state) => state.Location.Location)
    const [editLocation, seteditLocation] = useState([])
    const [selectedLocation , setselectedLocation] = useState([])

    const LocationDrp = location?.map((item) => {
        return { value: item._id, label: item.LocationName }
    })

    const defaultLocation = useMemo(() => {
        if (!editLocation || !editLocation.Location) return null;
        const found = location.find(item => item._id === editLocation.Location);
        return found ? { value: found._id, label: found.LocationName } : null;
    }, [editLocation, location]);

    const getData = () => {
        const data = locationEdit.find((item) => item._id == id)
        console.log(data)
        seteditLocation(data)

        if (data) {
            reset({
                StoreName: data.StoreName,
            })
        }

    }
    useEffect(() => {

        getData()
    }, [])
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset

    } = useForm();
    const navigate = useNavigate()
    const onSubmit = async (data) => {
        try {
            await updateDataFunction(`/Store/UpdateStore/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/Storelist')
            }, 2000);
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Store</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location Name </label>
                            <input
                                type="text"
                                defaultValue={editLocation.StoreName}
                                {...register("StoreName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location</label>
                            <Select
                                onChange={(val) => setselectedLocation(val.value)}
                                options={LocationDrp}
                                value={defaultLocation}
                                isDisabled={true}
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Store
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default StoreEdit