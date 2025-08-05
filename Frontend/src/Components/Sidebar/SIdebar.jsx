import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { open } from '../../Redux/Reducers/sidebarReducer.js';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import Cookies from 'js-cookie';
import { Logout } from '../../Redux/Reducers/LoginerReducer.js';
import { GrUserAdmin } from "react-icons/gr";
import {
    ReportsOpen, SetupOpen, Transtionopen, toggleReports,
    toggleSetup, toggleTranstion, ProductSetup, toggleProductSetup,
    UserSetup, toggleUserSetup,
    ClinetSetup,
    toggleClinetSetup,
    toggleOpeningBalance,
    OpeningBalanceOp,
    AccountsSetupopen,
    toggleAccountsSetup

} from '../../Redux/Reducers/SiderBarOtionFalse';
const SIdebar = () => {
    const SidebarOpen = useSelector((state) => state.isSideBar.state)

    const dispatch = useDispatch()
    const openTransaction = useSelector((state) => state.sidebarOptions.transtionOpen)
    const openSetup = useSelector((state) => state.sidebarOptions.Setup)
    const openProductSetup = useSelector((state) => state.sidebarOptions.openProductSetup)
    const openReprts = useSelector((state) => state.sidebarOptions.Reports)
    const userSetupDrp = useSelector((state) => state.sidebarOptions.userSetup)
    const clientSetupDrp = useSelector((state) => state.sidebarOptions.clinetSetup)
    const OpeningBalance = useSelector((state) => state.sidebarOptions.openingBalance)
    const AccountsSetup = useSelector((state)=> state.sidebarOptions.AccountsSetupopen)
    

    const ChevronIcon = ({ isOpen }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            viewBox="0 0 20 20"
            fill="currentColor"
        >
            <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
            />
        </svg>
    );

    // Navigation Item Component
    const NavItem = ({ to, label }) => (
        <li>
            <NavLink
                to={to}
                className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm transition-colors ${isActive
                        ? 'bg-cyan-800 text-white'
                        : 'text-gray-300 hover:bg-cyan-700 hover:text-white'
                    }`
                }
            >
                {label}
            </NavLink>
        </li>
    );

    // Dropdown Section Component with customizable icon
    const DropdownSection = ({ title, isOpen, toggle, children, icon }) => (
        <li>
            <button
                onClick={toggle}
                className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left text-white transition-colors hover:bg-cyan-700"
            >
                <span className="flex items-center">
                    {icon}
                    {title}
                </span>
                <ChevronIcon isOpen={isOpen} />
            </button>

            {isOpen && (
                <ul className="mt-1 space-y-1 pl-7 border-l border-gray-700">
                    {children}
                </ul>
            )}
        </li>
    );

    // Icon components
    const SettingsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );

    const TransactionIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    const ReportsIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    );

    const DashboardIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
    );

    const LogoutIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
    );


    const [isReports, setisReports] = useState(false);

    const navigate = useNavigate()

    const toggleTransaction = () => {
        if (openTransaction == false) {
            dispatch(Transtionopen(true))

        }
        else {
            dispatch(toggleTranstion(false))
        }
    };
    const toggleAccounts = () => {
      console.log(AccountsSetup)
        if (AccountsSetup == false) {
            dispatch(AccountsSetupopen(true))

        }
        else {
            dispatch(toggleAccountsSetup(false))
        }
    };
    const toggleSetupDropdown = () => {
        if (openSetup == false) {
            dispatch(SetupOpen(true))

        }
        else {
            dispatch(toggleSetup(false))
        }
    };
    const toggleReportsDropdown = () => {
        console.log(openReprts)
        if (openReprts == false) {
            dispatch(ReportsOpen(true))

        }
        else {
            dispatch(toggleReports(false))
        }
    };
    const logout = () => {
        console.log("logout")
        Cookies.remove("token")
        dispatch(Logout())
        navigate('/')


    }
    const toggleProductSetuoDropdown = () => {
        if (openProductSetup == false) {
            dispatch(ProductSetup(true))

        }
        else {
            console.log(openProductSetup)
            dispatch(toggleProductSetup(false))
        }
    }
    const toggleUserSetuoDropdown = () => {
        console.log(userSetupDrp)
        if (userSetupDrp == false) {
            dispatch(UserSetup(true))

        }
        else {
            console.log(openProductSetup)
            dispatch(toggleUserSetup(false))
        }
    }
    const toggleCLientSetuoDropdown = () => {
        console.log(clientSetupDrp)
        if (clientSetupDrp == false) {
            dispatch(ClinetSetup(true))

        }
        else {
            console.log(openProductSetup)
            dispatch(toggleClinetSetup(false))
        }
    }
    const toggleOpeningBalanceDrp = () => {
        if (OpeningBalance == false) {
            dispatch(OpeningBalanceOp(true))

        }
        else {

            dispatch(toggleOpeningBalance(false))
        }
    }

    return (
      <div 
      className={`inset-y-0 left-0 z-50 h-screen w-64 bg-gray-900 shadow-xl transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 ${
        SidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex h-full flex-col fixed">
        {/* Brand Header */}
        <div className="border-b border-gray-700 p-6">
          <h1 className="text-2xl font-bold text-cyan-400">
            <span className="text-white">Pearl</span> Dynamic
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link 
                to="/"
                className="flex items-center rounded-lg px-4 py-3 text-white transition-colors hover:bg-cyan-700"
              >
                <DashboardIcon />
                Dashboard
              </Link>
              
            </li>
                 <li>
              <Link 
                to="/Administrative"
                className="flex items-center rounded-lg px-4 py-3 text-white transition-colors hover:bg-cyan-700"
              >
                <GrUserAdmin /> &nbsp; Administrative

              </Link>
              
            </li>
            {/* Setup Section */}
            <DropdownSection 
              title="Setup"
              isOpen={openSetup}
              toggle={toggleSetupDropdown}
              icon={<SettingsIcon />}
            >
              {/* User Setup */}
              <DropdownSection 
                title="User Setup"
                isOpen={userSetupDrp}
                toggle={toggleUserSetuoDropdown}
              >
                <NavItem to="/userlist" label="Users" />
                <NavItem to="/UserRolls" label="User Roles" />
                <NavItem to="/Locationlist" label="Location" />
                <NavItem to="/StoreList" label="Store" />
              </DropdownSection>

                <DropdownSection 
                title="Accounts Setup"
                isOpen={AccountsSetup}
                toggle={toggleAccounts}
              >
                <NavItem to="/ChartofAccounts" label="Chart of Accounts" />

              </DropdownSection>

              {/* Product Setup */}
              <DropdownSection 
                title="Product Setup"
                isOpen={openProductSetup}
                toggle={toggleProductSetuoDropdown}
              >
                <NavItem to="/VendorList" label="Vendor" />
                <NavItem to="/ProductList" label="SKU" />
              </DropdownSection>

              {/* Customer Setup */}
              <DropdownSection 
                title="Customer"
                isOpen={clientSetupDrp}
                toggle={toggleCLientSetuoDropdown}
              >
                <NavItem to="/clientList" label="Customers" />
                <NavItem to="/Zonelist" label="Zone" />
                <NavItem to="/Regionlist" label="Region" />
                <NavItem to="/CityList" label="City" />
                <NavItem to="/Terrotorylist" label="Territory" />
                <NavItem to="/OrderBookerList" label="Order Booker" />
              </DropdownSection>

              {/* Opening Balance */}
              <DropdownSection 
                title="Opening Balance"
                isOpen={OpeningBalance}
                toggle={toggleOpeningBalanceDrp}
              >
                <NavItem 
                  to="/OpeningInventory" 
                  label="Inventory Opening" 
                />
                  <NavItem 
                  to="/AccountOpeninigBalance" 
                  label="Accounts" 
                />
              </DropdownSection>
            </DropdownSection>

            {/* Transactions */}
            <DropdownSection 
              title="Transactions"
              isOpen={openTransaction}
              toggle={toggleTransaction}
              icon={<TransactionIcon />}
            >
              
              <NavItem to="/PurchaseInvoiceList" label="Purchase Invoice" />
              <NavItem to="/SalesInvoice" label="Sales Order" />
              <NavItem to="/SalesInvoice" label="Sales Invoice Dc" />
              <NavItem to="/SalesInvoice" label="Sales Invoice" />

              <NavItem to="/BankPaymentVoucherList" label="Voucher" />



            </DropdownSection>

            {/* Reports */}
            <DropdownSection 
              title="Reports"
              isOpen={openReprts}
              toggle={toggleReportsDropdown}
              icon={<ReportsIcon />}
            >
              <NavItem to="/AllStock" label="All Stock" />
              <NavItem to="/StockFlowReport" label="Stock Flow Report" />
              <NavItem to="/InventoryValutionSummary" label="Inventory Valuation Summary" />
              <NavItem to="/InventoryValution" label="Inventory Valuation" />
              <NavItem to="/GenralLager" label="Genral Lager" />
            </DropdownSection>
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <button 
            onClick={logout}
            className="flex w-full items-center rounded-lg px-4 py-3 text-red-400 transition-colors hover:bg-red-900 hover:text-white"
          >
            <LogoutIcon />
            Logout
          </button>
        </div>
      </div>
    </div>

    )
}

export default SIdebar
