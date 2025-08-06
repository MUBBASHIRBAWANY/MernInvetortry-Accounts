import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDate } from '../../Global/getDate';
import Select from 'react-select'
import { createDataFunction } from '../../../Api/CRUD Functions';


const UserAdd = () => {
  const navigate = useNavigate()
  const loginuser = useSelector((state) => state.LoginerReducer.userDetail)
  const [selectedRole, setselectedRole] = useState()
  const [selectedLocation, setselectedLocation] = useState()
  const [selectedStore, setselectedStore] = useState()
  const [StoreDrp, setStoreDrp] = useState([])
  const [selectedVendor, setselectedVendor] = useState()
  const [userType, SetUserType] = useState(false)
  const [user, setUser] = useState(1)

  loginuser.email
  const checkRight = () => {
    if (loginuser.email == "admin@js.com") {
      return null
    }
    else {
      navigate('/')
    }
  }

  useEffect(() => {
    checkRight()
  },[])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  let userRole = useSelector((state) => state.UsersRole.state)
  let Location = useSelector((state) => state.Location.Location)
  let Store = useSelector((state) => state.Store.Store)
  let Vendor = useSelector((state) => state.Vendor.state)

  const LocationDrp = Location?.map((item) => {
    return { value: item._id, label: item.LocationName }
  })

  const VendorDrp = Vendor?.map((item) => {
    return { value: item._id, label: item.VendorName }
  })
const setDrp = (selectedValues) => {
  const values = selectedValues.map(item => item.value);

  setselectedLocation(values);

  if (SetUserType === true) {
    const newStoreOptions = Store?.filter(item => values.includes(item.Location))
      .map(item => ({
        value: item._id,
        label: item.StoreName,
      }));
    
    setStoreDrp(newStoreOptions);
    setselectedStore([]); // reset store selection
  } else {
    const storeDrp = Store?.filter(item => values.includes(item.Location))
      .map(item => ({
        value: item._id,
        label: item.StoreName,
      }));

    setStoreDrp(storeDrp);
    console.log("Store dropdown updated for non-SetUserType");
  }
};

const setDrpSingle = (value) => {
    if (SetUserType == true) {
      setselectedLocation(value);
      const newStoreOptions = Store?.filter((item) => item.Location === value)
        .map((item) => ({
          value: item._id,
          label: item.StoreName,
        }));
      setStoreDrp(newStoreOptions);
      setselectedStore([]);
    }
    else {
      setselectedLocation(value)
      const StoreDrp = Store?.filter((item) => item.Location == value).map((item) => {
        return { value: item._id, label: item.StoreName }
      })
      setStoreDrp(StoreDrp)
    }

  }
  let RoleDropDown = userRole?.map((item) => {
    return { value: item._id, label: item.RoleName }
  })


  const onSubmit = async (data) => {
    console.log(data)
    if (data.password != data.Cpassword) {
      return toast.error("pasword & confirm password should be same")
    }

    else {
      try {
        data.createdBy = loginuser.firstname
        data.createDate = updateDate()
        data.userType = user
        data.selectRole = selectedRole
        data.Location = Array.isArray(selectedLocation) ? selectedLocation : [selectedLocation]
        data.Store = Array.isArray(selectedStore) ? selectedStore : [selectedStore];
        data.Vendor = Array.isArray(selectedVendor) ? selectedVendor : [selectedVendor];
         console.log(data)
         await createDataFunction('/users', data)

        toast.success("Data Add")
        setTimeout(() => {
          navigate('/userlist')
        }, 2000);
      } catch (err) {
        toast.error("First Name duplicate")
      }
    }

  };
  const SetMulti = (val) => {
    setUser(val)
    if (val == 1) {
      SetUserType(false)
    }
    else {
      SetUserType(true)
    }
  }
  useEffect(() => {
    if (userType) {
      setselectedStore([]);
      setselectedVendor([]);
    } else {
      setselectedStore("");
      setselectedVendor("");
    }
  }, [userType]);
  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add User</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">First Name</label>
              <input
                type="text"
                {...register("firstname")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
              <input
                type="text"
                {...register("lastname")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>

              <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input
                type="text"
                {...register("phoneNumber")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password </label>
              <input
                type="text"
                {...register("password")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password </label>
              <input
                type="text"
                {...register("Cpassword")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">User Role </label>
              <Select onChange={(val) => setselectedRole(val.value)} options={RoleDropDown} />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">User Type </label>
              <select {...register("userType")} onChange={(e) => SetMulti(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="" id="">
                <option value="1">Kpo</option>
                <option value="2">User</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              {userType ? (
                <Select
                  isMulti
                  onChange={(val) => setDrp(val)}
                  options={LocationDrp}
                />
              ) : (<Select
                onChange={(val) => setDrpSingle(val.value)}
                options={LocationDrp}
              />)
              }
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Store</label>

              {userType ? (
                <Select
                  isMulti
                  onChange={(val) => setselectedStore(val?.map(v => v.value) || [])}
                  options={StoreDrp}
                  value={StoreDrp.filter(opt => selectedStore.includes(opt.value))}
                />
              ) : (
                <Select
                  onChange={(val) => setselectedStore(val.value)}
                  options={StoreDrp}
                  value={StoreDrp.find(opt => opt.value === selectedStore) || null}
                />
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Vendor </label>

              {userType ? (
                <Select
                  isMulti
                  onChange={(val) => setselectedVendor(val?.map(v => v.value) || [])}
                  options={VendorDrp}
                  value={VendorDrp.filter(opt => selectedVendor?.includes(opt?.value))} />
              ) :
                (<Select onChange={(val) => setselectedVendor(val.value)} options={VendorDrp}
                  value={VendorDrp.find(opt => opt.value === selectedVendor) || null} />)}
            </div>
            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};


export default UserAdd