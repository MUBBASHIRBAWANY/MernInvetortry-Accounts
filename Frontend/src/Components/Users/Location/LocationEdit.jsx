import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDataFunction } from '../../../Api/CRUD Functions';


const LocationEdit = () => {
    const { id } = useParams()
    const locationEdit = useSelector((state) => state.Location.Location)
    console.log(locationEdit)
    const Zone = useSelector((state) => state.Zone.zone)
    const [editLocation, seteditLocation] = useState([])
    const [selectZone, setSelectzone] = useState(undefined)
    const getData = () => {
        const data = locationEdit.find((item) => item._id == id)
        console.log(data)
        seteditLocation(data)
        const selectZone = Zone?.find((item) => item._id == data?.Zone)
        console.log(selectZone)

        if (data) {
            reset({
                LocationName: data.LocationName,
            })
        }

    }
     const UserRihts = useSelector((state) => state.UsersRights.UserRights)
      const pageName = "Edit Location"
      const checkAcess = async () => {
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
          navigate("/")
        }
      }
    
    useEffect(() => {
        checkAcess()

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
          await  updateDataFunction(`/Location/Updatelocation/${id}`, data)
            toast.success("Data Edit")
            setTimeout(() => {
                navigate('/LocationList')
            }, 2000);
        } catch (err) {
            console.log(err)
        }
    }
    
    return (
        <div>
            <div>
                <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Edit Location</h1>
                <ToastContainer />
                <div>
                    <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Location Name </label>
                            <input
                                type="text"
                                defaultValue={editLocation.LocationName}
                                {...register("LocationName")}
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Edit Location
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LocationEdit