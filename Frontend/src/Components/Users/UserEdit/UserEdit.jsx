
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { updateDate } from '../../Global/getDate';
import Select from 'react-select';
import { updateDataFunction } from '../../../Api/CRUD Functions';
import { isObject } from '@mui/x-data-grid/internals';

const UserEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const loginuser = useSelector((state) => state.LoginerReducer.userDetail);
  const list1 = useSelector((state) => state.users1.state);
  const userRole = useSelector((state) => state.UsersRole.state);
  let Location = useSelector((state) => state.Location.Location)
  let Store = useSelector((state) => state.Store.Store)
  let Vendor = useSelector((state) => state.Vendor.state)

  const [finduser, setFinduser] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [storeDrp, setStoreDrp] = useState([]);
  const [defultLocation , setDefultLocation] = useState([])

  const [userType, SetUserType] = useState(false)

  const { register, handleSubmit, reset } = useForm();

  const checkRight = () => {
    if (loginuser.email !== "admin@js.com") {
      navigate('/');
    }
  };

  const LocationDrp = Location?.map((item) => {
    return { value: item._id, label: item.LocationName }
  })

  const VendorDrp = Vendor?.map((item) => {
    return { value: item._id, label: item.VendorName }
  })



  const finddata = () => {
    console.log(userType)
    if (!list1) {
      navigate("/userlist");
    } else {
      const data = list1.find((item) => item._id === id);
      setFinduser(data);

      if (data && userRole) {
        const matchedRole = userRole.find((val) => val._id === data.selectRole);
        if (matchedRole) {
          setSelectedRole({
            value: matchedRole._id,
            label: matchedRole.RoleName
          });
        }

        if (data.Vendor) {
          if (data.userType == 2) {
            SetUserType(true);

            const defultStoreValues = data.Store;
            setSelectedStore(defultStoreValues);

            const defultVendorValues = data.Vendor;
            setSelectedVendor(defultVendorValues);
          }
          else {
            const defultStore = Store.find((item) => item._id == data.Store[0])
            const defultStoreOption = {
              label: `${defultStore?.StoreName} ${defultStore?.code}`,
              value: defultStore?._id
            }
            setSelectedStore(defultStoreOption)

            const defultVendor = Vendor.find((item) => item._id == data?.Vendor[0])
            const defultVendorOption = {
              label: `${defultVendor?.VendorName} ${defultVendor?.code}`,
              value: defultVendor?._id
            }
            setSelectedVendor(defultVendorOption)
          const defultLocation = Location.find((item)=> item._id == data.Location[0])
          const defultLocationOption = {
            label : defultLocation?.LocationName,
            value : defultLocation?._id

          }
          setDefultLocation(defultLocationOption)
          }

        }


        if (data.userType == 2) {
          const matchedLocation = Location.filter((item, index) => item._id == data.Location[index])
            .map((macthLoc) => macthLoc._id);
          console.log(matchedLocation)
          setSelectedLocation(matchedLocation)
          const selectedLocationIds = data.Location;

          const filteredStores = Store.filter(store =>
            selectedLocationIds.includes(store.Location)
          );
          const store = filteredStores.map((item) => ({
            label: item.StoreName,
            value: item._id
          }))
          setStoreDrp(store)

        } else {
          const matchedLocation = Location.find((item) => item._id == data.Location);
          if (matchedLocation) {
            const locationOption = {
              value: matchedLocation._id,
              label: matchedLocation.LocationName
            }
            setSelectedLocation(locationOption.value);


            const storesForLocation = Store?.filter((item) => item.Location == data.Location).map((item) => {
              return { value: item._id, label: item.StoreName }
            });
            setStoreDrp(storesForLocation || []);
          }




        }

        if (data.Store) {
          const matchedStore = Store.filter((item) => data.Store);

          if (matchedStore) {
            const defaultStore = matchedStore.map((item) => {
              label: item.StoreName
              value: item._id
            })
            console.log(defaultStore)

          }
        }
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    finddata();
    checkRight();
  }, [id, list1, userRole]);





const setDrpSingle = (value) => {
  console.log(value);
  const values = value.value;

  setSelectedLocation(values);

  // Clear selected store first
  setSelectedStore([]); // or null based on your initial state

  // Now update store dropdown
  const updatedStoreDrp = Store?.filter(item => values.includes(item.Location))
    .map(item => ({
      value: item._id,
      label: item.StoreName,
    }));

  setStoreDrp(updatedStoreDrp);

  console.log("Store dropdown updated for non-SetUserType");
};


  const onSubmit = async (data) => {
    console.log(selectedVendor)
    if (!selectedLocation || !selectedStore || !selectedVendor || !selectedVendor) {
      return toast.error("All DropDown Is Requried")
    }
    data.updateDate = updateDate();

    data.Location = Array.isArray(selectedLocation) ? selectedLocation : [selectedLocation];
    data.Store = Array.isArray(selectedStore) ? selectedStore : data.Store = [selectedStore.value];
    data.Vendor = Array.isArray(selectedVendor) ? selectedVendor : data.Vendor = [selectedVendor.value];
    data.selectRole = selectedRole ? selectedRole.value : null;

    try {
      console.log(data)
      const res = await updateDataFunction(`/users/user/${id}`, data)
      toast.success("User Updated Successfully");
      setTimeout(() => navigate('/userlist'), 1500);
    } catch (err) {
      toast.error("Error Updating User");
      console.error(err);
    }
  };

  const RoleDropDown = userRole?.map((item) => ({
    value: item._id,
    label: item.RoleName
  })) || [];

const setDrp = (selectedValues) => {
  const values = selectedValues.map(item => item.value);

  setSelectedLocation(values);
setSelectedStore([]);
  if (SetUserType === true) {
    const newStoreOptions = Store?.filter(item => values.includes(item.Location))
      .map(item => ({
        value: item._id,
        label: item.StoreName,
      }));
    
    setStoreDrp(newStoreOptions);
    setSelectedStore([]);
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
  if (isLoading) return <div className="text-center py-10">Loading User Data...</div>;
  return (

    <div>
      <div>
        <h1 className="text-3xl font-bold text-center  text-gray-800 mb-6">Add User</h1>
        <ToastContainer />
        <div>
          <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6" onSubmit={handleSubmit(onSubmit)}>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">First Name</label>
              <input
                type="text"
                defaultValue={finduser.firstname}
                {...register("firstname")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Last Name</label>
              <input
                type="text"
                defaultValue={finduser.lastname}
                {...register("lastname")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
              <input
                type="text"
                defaultValue={finduser.phoneNumber}
                {...register("phoneNumber")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Password</label>
              <input

                {...register("password")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank to keep current"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Confirm Password</label>
              <input

                {...register("Cpassword")}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Leave blank to keep current"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">User Role</label>
              <Select
                value={selectedRole}
                onChange={setSelectedRole}
                options={RoleDropDown}
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">User Type </label>
              <select {...register("userType")}
                defaultValue={finduser.userType}
                disabled={true}
                style={{ backgroundColor: 'lightgray' }}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" name="" id="">
                <option value="1">Kpo</option>
                <option value="2">User</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Location</label>
              {userType ? (
                <Select
                  isMulti
                  onChange={(val) => setDrp(val)}
                  options={LocationDrp}
                  defaultValue={LocationDrp.filter(opt => selectedLocation?.includes(opt.value))}
                />
              ) : (<Select
                onChange={(val) => setDrpSingle(val)}
                options={LocationDrp}
                defaultValue={defultLocation}
              />)
              }

            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Store</label>
              {userType ? (
                <Select
                  isMulti
                  options={storeDrp}
                  value={storeDrp.filter(opt => selectedStore?.includes(opt.value))}
                  onChange={(val) => setSelectedStore(val?.map(v => v.value) || [])}
                />
              ) : (
                <Select
                  onChange={(val) => setSelectedStore(val || [])}
                  options={storeDrp}
                  value={selectedStore}
                  isClearable
                />
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">Vendor</label>
              {userType ? (
                <Select
                  isMulti
                  defaultValue={VendorDrp.filter(opt => selectedVendor?.includes(opt.value))}
                  onChange={(val) => setSelectedVendor(val?.map(v => v.value) || [])}
                  options={VendorDrp}
                />
              ) : (<Select onChange={(val) => setSelectedVendor(val)} options={VendorDrp}
                value={selectedVendor} />)}
            </div>

            <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-6">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              >
                Update User
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserEdit