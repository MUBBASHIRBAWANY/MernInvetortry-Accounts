import axios from 'axios';
import React from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { updateDataFunction } from '../../../Api/CRUD Functions';

const PasswordUpdate = () => {
  const navigate = useNavigate();
const loginuser = useSelector((state)=> state.LoginerReducer.userDetail)


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    data.updatedBy = loginuser.firstname
    const id = loginuser._id
    console.log(data)
    const res = await updateDataFunction(`/users/user/${id}` , data)
    console.log(res)

  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-lg shadow-md mb-6"
      >
        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <label className="block text-gray-700 font-semibold mb-2">Password</label>
          <input
            type="text"
            {...register("password", { required: true })}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">Password is required.</p>}
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit User
          </button>
        </div>
      </form>
    </div>
  );
};

export default PasswordUpdate;
