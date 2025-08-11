import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { updateDate } from "../../Global/getDate";
import { createDataFunction, updateDataFunction } from "../../../Api/CRUD Functions";
import { useNavigate, useParams } from "react-router-dom";

// Updated TreeNode component with checked state
const TreeNode = ({ node, onCheck, selectedRoles }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="ml-4">
      {node.children ? (
        <div>
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="flex items-center mb-1"
          >
            <span className="mr-2">{expanded ? "-" : "+"}</span>
            <span className="font-semibold">{node.label}</span>
          </button>
          {expanded && (
            <div className="ml-6 border-l pl-4">
              {node.children.map((child) => (
                <TreeNode 
                  key={child.id} 
                  node={child} 
                  onCheck={onCheck} 
                  selectedRoles={selectedRoles}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <label className="flex items-center space-x-2 mb-1">
          <input
            type="checkbox"
            checked={selectedRoles.includes(node.label)}
            onChange={(e) => onCheck(node.label, e.target.checked)}
            className="form-checkbox h-4 w-4 text-blue-500"
          />
          <span>{node.label}</span>
        </label>
      )}
    </div>
  );
};

export default function UserRoleAddTree() {
  const { register, handleSubmit, reset } = useForm();
  const [selectedRoles, setSelectedRoles] = useState([]);
  const loginuser = useSelector((state) => state.LoginerReducer.userDetail);
  const EditRole = useSelector((state) => state.UsersRole.state);
  const { id } = useParams();
  const navigate = useNavigate();

  const handleCheck = (label, checked) => {
    setSelectedRoles((prev) =>
      checked ? [...prev, label] : prev.filter((item) => item !== label)
    );
  };

  const getData = async () => {
    const data = EditRole.find((item) => item._id === id);
    if (data) {
      setSelectedRoles(data.Roles || []);
      reset({
        RoleName: data.RoleName || '',
      });
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id, EditRole]);

   const treeData = [
    {
      id: "setup",
      label: "Setup",
      children: [
        {
          id: "userSetup",
          label: "User Setup",
          children: [
            {
              id: "userRole",
              label: "User Role",
              children: [
                { id: "AddUserRole", label: "Add User Role" },
                { id: "editUserRole", label: "Edit User Role" },
                { id: "DeleteUserRole", label: "Delete User Role" },
                { id: "ListUserRole", label: "List User Role" }
              ]
            },
            {
              id: "Location",
              label: "Location",
              children: [
                { id: "AddLocation", label: "Add Location" },
                { id: "editLocation", label: "Edit Location" },
                { id: "DeleteLocation", label: "Delete Location" },
                { id: "ListLocation", label: "List Location" }
              ]
            },
            {
              id: "Store",
              label: "Store",
              children: [
                { id: "AddStore", label: "Add Store" },
                { id: "editStore", label: "Edit Store" },
                { id: "DeleteStore", label: "Delete Store" },
                { id: "ListStore", label: "List Store" }
              ]
            }
          ]
        },
        {
          id: "AccountsSetup",
          label: "Accounts Setup",
          children: [
            {
              id: "ChartAccounts",
              label: "Chart of Accounts",
              children: [
                { id: "AddChart", label: "Add Chart of Accounts" },
                { id: "editChart", label: "Edit Chart of Accounts" },
                { id: "DeleteChart", label: "Delete Chart of Accounts" },
                { id: "ListChart", label: "List Chart of Accounts" },
                { id: "ChartTree", label: "Chart of Accounts Tree View" }
              ]
            }
          ]
        },
        {
          id: "ProductSetup",
          label: "Product Setup",
          children: [
            {
              id: "Vendor",
              label: "Vendor",
              children: [
                { id: "AddVendor", label: "Add Vendor" },
                { id: "editVendor", label: "Edit Vendor" },
                { id: "DeleteVendor", label: "Delete Vendor" },
                { id: "ListVendor", label: "List Vendor" }
              ]
            },
            {
              id: "SKU",
              label: "SKU",
              children: [
                { id: "AddSKU", label: "Add SKU" },
                { id: "editSKU", label: "Edit SKU" },
                { id: "DeleteSKU", label: "Delete SKU" },
                { id: "ListSKU", label: "List SKU" }
              ]
            }

          ]
        },
        {
          id: "CustomerSetup",
          label: "Customer Setup",
          children: [
            {
              id: "Customer",
              label: "Customer",
              children: [
                { id: "AddCustomer", label: "Add Customer" },
                { id: "editCustomer", label: "Edit Customer" },
                { id: "DeleteCustomer", label: "Delete Customer" },
                { id: "ListCustomer", label: "List Customer" }
              ]
            },
            {
              id: "Zone",
              label: "Zone",
              children: [
                { id: "AddZone", label: "Add Zone" },
                { id: "editZone", label: "Edit Zone" },
                { id: "DeleteZone", label: "Delete Zone" },
                { id: "ListZone", label: "List Zone" }
              ]
            },
            {
              id: "Region",
              label: "Region",
              children: [
                { id: "AddRegion", label: "Add Region" },
                { id: "editRegion", label: "Edit Region" },
                { id: "DeleteRegion", label: "Delete Region" },
                { id: "ListRegion", label: "List Region" }
              ]
            },
            {
              id: "City",
              label: "City",
              children: [
                { id: "AddCity", label: "Add City" },
                { id: "editCity", label: "Edit City" },
                { id: "DeleteCity", label: "Delete City" },
                { id: "ListCity", label: "List City" }
              ]
            },
            {
              id: "Order Booker",
              label: "Order Booker",
              children: [
                { id: "AddOrder Booker", label: "Add Order Booker" },
                { id: "editOrder Booker", label: "Edit Order Booker" },
                { id: "DeleteOrder Booker", label: "Delete Order Booker" },
                { id: "ListOrder Booker", label: "List Order Booker" }
              ]
            },
          ]
        },
         {
          id: "Opening Balance",
          label: "Opening Setup",
          children: [
            {
              id: "OpeningBalance",
              label: "OpeningBalance",
              children: [
                { id: "AddOpeningBalance", label: "Add Opening Balance" },
                { id: "editOpeningBalance", label: "Edit Opening Balance" },
                { id: "DeleteOpeningBalance", label: "Delete Opening Balance" },
                { id: "ListOpeningBalance", label: "List Opening Balance" }
              ]
            },
            {
              id: "Account Opening",
              label: "Account Opening",
              children: [
                { id: "AddAccountOpening", label: "Add Account Opening" },
                { id: "editAccountOpening", label: "Edit Account Opening" },
                { id: "DeleteAccountOpening", label: "Delete Account Opening" },
                { id: "ListAccountOpening", label: "List Account Opening " }
              ]
            }

          ]
        },
      ]
    },
     {
      id: "Transaction",
      label: "Transaction",
      children: [
        {
          id: "Inventory Transaction",
          label: "Inventory Transaction",
          children: [
            {
              id: "Purchase",
              label: "Purchase",
              children: [
                { id: "AddPurchase", label: "Add Purchase" },
                { id: "editPurchase", label: "Edit Purchase" },
                { id: "DeletePurchase", label: "Delete Purchase" },
                { id: "ListPurchase", label: "List Purchase" },
                { id: "ViewPurchase", label: "View Purchase" },
              ]
            },
            {
              id: " SalesOrder",
              label: " SalesOrder",
              children: [
                { id: "Add SalesOrder", label: "Add Sales Order" },
                { id: "edit SalesOrder", label: "Edit Sales Order" },
                { id: "Delete SalesOrder", label: "Delete Sales Order" },
                { id: "List SalesOrder", label: "List Sales Order" },
                { id: "View SalesOrder", label: "View Sales Order" },
              ]
            },
          {
              id: "SalesOrderDc",
              label: "Sales Order Dc",
              children: [
                { id: "Add SalesOrderDc", label: "Add Sales Order Dc" },
                { id: "edit SalesOrderDc", label: "Edit Sales Order Dc" },
                { id: "Delete SalesOrderDc", label: "Delete Sales Order Dc" },
                { id: "List SalesOrderDc", label: "List Sales Order Dc" },
                { id: "View SalesOrderDc", label: "View Sales Order Dc" },
              ]
            },
            {
              id: "SalesInvoice",
              label: "Sales Invoice",
              children: [
                { id: "Add SalesInvoice", label: "Add Sales Invoice" },
                { id: "edit SalesInvoice", label: "Edit Sales Invoice" },
                { id: "Delete SalesInvoice", label: "Delete Sales Invoice" },
                { id: "List SalesInvoice", label: "List Sales Invoice" },
                { id: "View SalesInvoice", label: "View Sales Invoice" },
              ]
            },
          ]
        },
       {
          id: "Voucher Transaction",
          label: "Voucher Transaction",
          children: [
            {
              id: "CashBook",
              label: "CashBook",
              children: [
                { id: "AddCashBook", label: "Add Cash Book" },
                { id: "editCashBook", label: "Edit Cash Book" },
                { id: "DeleteCashBook", label: "Delete Cash Book" },
                { id: "ListCashBook", label: "List Cash Book" },
                { id: "ViewCashBook", label: "View Cash Book" },
              ]
            },
            {
              id: "BankBook",
              label: "Bank Book",
              children: [
                { id: "AddBankBook", label: "Add Bank Book" },
                { id: "editBankBook", label: "Edit Bank Book" },
                { id: "DeleteBankBook", label: "Delete Bank Book" },
                { id: "ListBankBook", label: "List Bank Book" },
                { id: "ViewBankBook", label: "View Bank Book" },
              ]
            },
          {
              id: "JournalVoucher",
              label: "Journal Voucher",
              children: [
                { id: "AddJournalVoucher", label: "Add Journal Voucher" },
                { id: "editJournalVoucher", label: "Edit Journal Voucher" },
                { id: "DeleteJournalVoucher", label: "Delete Journal Voucher" },
                { id: "ListJournalVoucher", label: "List Journal Voucher" },
                { id: "ViewJournalVoucher", label: "View Journal Voucher" },
              ]
            },
           
          ]
        },
        
      ]
    }
  ];
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const pageName = "Edit User Role"
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
  const onSubmit = async (data) => {
    const roleData = {
      RoleName: data.RoleName,
      Roles: selectedRoles,
      createdBy: loginuser.firstname,
      createDate: updateDate()
    };

    try {
      await updateDataFunction(`/userRole/rolesUpdaate/${id}`, roleData);
      toast.success("Role saved successfully");
      setTimeout(() => {
        navigate('/UserRolls');
      }, 2000);
    } catch (err) {
      toast.error("Something went wrong");
      console.error("Submission error:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-6 rounded-lg shadow-md"
    >
      <div className="mb-8">
        <ToastContainer />
        <label className="block text-gray-700 font-semibold mb-2">
          Role Name
        </label>
        <input
          type="text"
          {...register("RoleName", { required: true })}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="space-y-2">
        {treeData.map((node) => (
          <TreeNode 
            key={node.id} 
            node={node} 
            onCheck={handleCheck} 
            selectedRoles={selectedRoles}
          />
        ))}
      </div>

      <button
        type="submit"
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Save Role
      </button>
    </form>
  );
}