import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateDate } from '../../Global/getDate';
import { updateDataFunction } from '../../../Api/CRUD Functions';
const UserRoleEdit = () => {
    const { id } = useParams()
    const pageName = "UserRoleEdit"
    const navigate = useNavigate()
    const [roles, setRoles] = useState([])
    const loginuser = useSelector((state) => state.LoginerReducer.userDetail)
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
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
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            roles: {}
        }
    })
    const EditRole = useSelector((state) => state.UsersRole.state)
    const checkAcess = async () => {
        console.log(UserRihts)
        const allowAcess = await UserRihts.find((item) => item == pageName)
        console.log(allowAcess)
        if (!allowAcess) {
            navigate("/")
        }
    }
    const getData = async () => {
        const data = await EditRole.find((item) => item._id == id)
        console.log(data.Roles)
        setRoles(data?.Roles || [])

        // Set form default values
        reset({
            RoleName: data?.RoleName || '',
            roles: {
                VenderAdd: data?.Roles?.includes('VenderAdd') || false,
                VenderEdit: data?.Roles?.includes('VenderEdit') || false,
                VenderList: data?.Roles?.includes('VenderList') || false,
                VenderDelete: data?.Roles?.includes('VenderDelete') || false,
                UserRoleAdd: data?.Roles?.includes('UserRoleAdd') || false,
                UserRoleEdit: data?.Roles?.includes('UserRoleEdit') || false,
                UserRoleList: data?.Roles?.includes('UserRoleList') || false,
                UserRoleDelete: data?.Roles?.includes('UserRoleDelete') || false,
                CategoryAdd: data?.Roles?.includes('CategoryAdd') || false,
                CategoryEdit: data?.Roles?.includes('CategoryEdit') || false,
                CategoryList: data?.Roles?.includes('CategoryList') || false,
                CategoryDelete: data?.Roles?.includes('CategoryDelete') || false,
                BrandAdd: data?.Roles?.includes('BrandAdd') || false,
                BrandEdit: data?.Roles?.includes('BrandEdit') || false,
                BrandList: data?.Roles?.includes('BrandList') || false,
                BrandDelete: data?.Roles?.includes('BrandDelete') || false,
                MasterSkuAdd: data?.Roles?.includes('MasterSkuAdd') || false,
                MasterSkuEdit: data?.Roles?.includes('MasterSkuEdit') || false,
                MasterSkuList: data?.Roles?.includes('MasterSkuList') || false,
                MasterSkuDelete: data?.Roles?.includes('MasterSkuDelete') || false,
                ProductAdd: data?.Roles?.includes('ProductAdd') || false,
                ProductEdit: data?.Roles?.includes('ProductEdit') || false,
                ProductList: data?.Roles?.includes('ProductList') || false,
                ProductDelete: data?.Roles?.includes('ProductDelete') || false,
                CustomerAdd: data?.Roles?.includes('CustomerAdd') || false,
                CustomerEdit: data?.Roles?.includes('CustomerEdit') || false,
                CustomerList: data?.Roles?.includes('CustomerList') || false,
                CustomerDelete: data?.Roles?.includes('CustomerDelete') || false,

                // Add other roles if needed
            }
        })
    }



    useEffect(() => {
        checkAcess()
        getData()
    }, [id, EditRole])

    const onSubmit = async (data) => {

        const selectedRoles = Object.keys(data.roles).filter(
            (key) => data.roles[key]
        );
        data.Roles = selectedRoles
        data.updatedBy = loginuser.firstname
        data.updateDate = updateDate()
        try {
            const res = await updateDataFunction(`/userRole/rolesUpdaate/${id}`, data)

            navigate('/UserRolls')

        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div>
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
        </div>
    )
}

export default UserRoleEdit