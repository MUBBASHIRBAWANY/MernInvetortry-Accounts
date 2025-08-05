import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { updateDate } from '../../Global/getDate';
import { useNavigate } from 'react-router-dom';
import { createDataFunction } from '../../../Api/CRUD Functions';

const userRoleAdd = () => {
  const { register, handleSubmit, watch } = useForm();
  const navigate = useNavigate()
  const [sectionVisibility, setSectionVisibility] = useState({
    vendor: false,
    userRole: false,
    category: false,
  });
  const toggleSection = (section) => {
    setSectionVisibility((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
  const pageName = "UserRoleAdd"
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const checkAcess = async () => {
    const allowAcess = await UserRihts.find((item) => item == pageName)
    console.log(allowAcess)
    if (!allowAcess) {
      navigate("/")
    }
  }
  const loginuser = useSelector((state) => state.LoginerReducer.userDetail)
  const onSubmit = async (data) => {
    const selectedRoles = Object.keys(data.roles).filter(
      (key) => data.roles[key]
    );
    console.log("Selected Roles:", selectedRoles);
    data.Roles = selectedRoles
    data.createdBy = loginuser.firstname
    data.createDate = updateDate()
    console.log(data)
    try {
      const res = await createDataFunction("/userRole", data)
      navigate('/UserRolls')
    }
    catch (err) {
      console.log(err)
    }

  };
  useEffect(() => {
    checkAcess()
  }, [])

  return (
    <form
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-md mb-6"
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Role Name Field */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <label className="block text-gray-700 font-semibold mb-2">Role Name</label>
        <input
          type="text"
          {...register("RoleName")}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("vendor")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2 focus:outline-none"
        >
          Vendor Permissions
          <span>{sectionVisibility.vendor ? "▲" : "▼"}</span>
        </button>

        <div
          className={`transition-max-height duration-500 ease-in-out ${sectionVisibility.vendor ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("roles.VenderAdd")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Vendor Add</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("roles.VenderEdit")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Vendor Edit</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("roles.VenderList")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Vendor View</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register("roles.VenderDelete")}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="text-gray-700">Vendor Delete</span>
            </label>
          </div>
        </div>
      </div>


      {/* User Role */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("userRole")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2"
        >
          User Role
          <span>{sectionVisibility.userRole ? "▲" : "▼"}</span>
        </button>
        <div
          className={`transition-max-height ${sectionVisibility.userRole ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            {/* Checkboxes */}
            {/* ... repeat for other permissions */}
            {["UserRoleAdd", "UserRoleEdit", "UserRoleList", "UserRoleDelete"].map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`roles.${perm}`)} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{perm.replace("UserRole", "User Role ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("category")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2"
        >
          Category
          <span>{sectionVisibility.category ? "▲" : "▼"}</span>
        </button>
        <div
          className={`transition-max-height ${sectionVisibility.category ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            {["CategoryAdd", "CategoryEdit", "CategoryList", "CategoryDelete"].map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`roles.${perm}`)} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{perm.replace("Category", "Category ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("brand")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2"
        >
          Brand
          <span>{sectionVisibility.brand ? "▲" : "▼"}</span>
        </button>
        <div
          className={`transition-max-height ${sectionVisibility.brand ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            {["BrandAdd", "BrandEdit", "BrandList", "BrandDelete"].map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`roles.${perm}`)} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{perm.replace("Brand", "Brand ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Master Sku */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("masterSku")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2"
        >
          Master Sku
          <span>{sectionVisibility.masterSku ? "▲" : "▼"}</span>
        </button>
        <div
          className={`transition-max-height ${sectionVisibility.masterSku ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            {["MasterSkuAdd", "MasterSkuEdit", "MasterSkuList", "MasterSkuDelete"].map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`roles.${perm}`)} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{perm.replace("MasterSku", "MasterSku ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Product */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("product")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2"
        >
          Product
          <span>{sectionVisibility.product ? "▲" : "▼"}</span>
        </button>
        <div
          className={`transition-max-height ${sectionVisibility.product ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            {["ProductAdd", "ProductEdit", "ProductList", "ProductDelete"].map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`roles.${perm}`)} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{perm.replace("Product", "Product ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Customer */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <button
          type="button"
          onClick={() => toggleSection("customer")}
          className="w-full flex justify-between items-center text-left text-lg font-bold text-gray-800 mb-2"
        >
          Customer
          <span>{sectionVisibility.customer ? "▲" : "▼"}</span>
        </button>
        <div
          className={`transition-max-height ${sectionVisibility.customer ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
            }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 py-2">
            {["CustomerAdd", "CustomerEdit", "CustomerList", "CustomerDelete"].map((perm) => (
              <label key={perm} className="flex items-center space-x-2">
                <input type="checkbox" {...register(`roles.${perm}`)} className="form-checkbox h-5 w-5 text-blue-600" />
                <span className="text-gray-700">{perm.replace("Customer", "Customer ")}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 flex justify-end mt-4">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Role
        </button>
      </div>
    </form>

  )
}

export default userRoleAdd