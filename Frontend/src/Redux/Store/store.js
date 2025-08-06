import { configureStore, combineReducers } from '@reduxjs/toolkit'
import sidebarOptions from '../Reducers/SiderBarOtionFalse.js'
import sidebarReducer from "../Reducers/sidebarReducer";
import users from '../Reducers/userReduser.js'
import LoginerReducer from "../Reducers/LoginerReducer.js"
import UsersRole from "../Reducers/userRoleReduser.js"
import Vendor from "../Reducers/VendorReducer.js"
import Category from "../Reducers/CategoryReducer.js"
import Brand from "../Reducers/BrandRecducer.js"
import MasterSku from "../Reducers/MasterSkuReducer.js"
import UsersRights from "../Reducers/UseRights.js"
import product from '../Reducers/ProductReducer.js'
import Client from "../Reducers/ClientReducer.js"
import Zone from "../Reducers/ZoneReducer.js"
import Region from "../Reducers/RegionReducer.js"
import Terrotory from "../Reducers/TerrotoryReducer.js"
import TotalProducts from "../Reducers/TotalProductsReducer.js"
import ChannelType from "../Reducers/ChanneTypelReducer.js"
import Channel from "../Reducers/ChannelReducer.js"
import subChannel from "../Reducers/SubChannelReducer.js"
import City from "../Reducers/CityReducer.js"
import PurchaseOrder from "../Reducers/PurchaseOrderReducer.js"
import SalesInvoice from "../Reducers/SalesInvoiceReducer.js";
import OrderBooker from "../Reducers/OrderBookerReducer.js" 
import Openinginventory from "../Reducers/OpenIngInventory.js"
import { persistStore, persistReducer } from 'redux-persist';
import PurchaseInvoice from "../Reducers/PurchaseInvoiceReducer.js"
import storage from 'redux-persist/lib/storage';
import StockReplacement from '../Reducers/StockReplacement.js'
import Location from "../Reducers/LocationReducer.js"
import Store from "../Reducers/StoreReducer.js"
import TransferOut from "../Reducers/TransferOutReducer.js"
import TransferIn from "../Reducers/TransferInReducer.js"
import SalesInvoiceReturn from "../Reducers/SalesInvoiceReturnReducer.js"
import PurchaseReturn from "../Reducers/PurchaseReturnReducer.js"
import ChartofAccounts from "../Reducers/ChartofAccountsReduser.js"
import ClientOpeningReducer from "../Reducers/ClientOpeningReducer.js"
import VendorOpeningReducer from "../Reducers/VendoropeningReducer.js"
import AccountOpeningReducer from "../Reducers/AccountOpeningReducer.js";
import OpeningInvoices from "../Reducers/OpeningInvoicesReducer.js";
import AdminReducer from "../Reducers/AdminReducer.js";
import VoucherReducer  from '../Reducers/VoucherReducer.js';
import ChqBook from '../Reducers/ChqBookReducer.js';
import SaleOrder from "../Reducers/SaleOrderReducer.js"
const rootReducer = combineReducers({
    isSideBar: sidebarReducer,
    sidebarOptions: sidebarOptions,
    users1: users,
    LoginerReducer: LoginerReducer,
    UsersRole: UsersRole,
    Vendor: Vendor,
    Category: Category,
    Brand: Brand,
    MasterSku: MasterSku,
    UsersRights: UsersRights,
    Product: product,
    Client : Client,
    Zone : Zone,
    Region : Region,
    Terrotory : Terrotory,
    ChannelType : ChannelType,
    Channel : Channel,
    subChannel : subChannel,
    City : City,
    PurchaseOrder : PurchaseOrder,
    PurchaseInvoice : PurchaseInvoice,
    SalesInvoice : SalesInvoice,
    OrderBooker : OrderBooker,
    StockReplacement : StockReplacement,
    Openinginventory : Openinginventory,
    Location : Location,
    Store : Store,
    TotalProducts : TotalProducts,
    TransferOut : TransferOut,
    TransferIn : TransferIn ,
    SalesInvoiceReturn : SalesInvoiceReturn,
    PurchaseReturn : PurchaseReturn,
    ChartofAccounts : ChartofAccounts,
    ClientOpeningReducer : ClientOpeningReducer,
    VendorOpeningReducer : VendorOpeningReducer,
    AccountOpeningReducer : AccountOpeningReducer,
    OpeningInvoices : OpeningInvoices,
    AdminReducer : AdminReducer,
    VoucherReducer : VoucherReducer,
    ChqBook : ChqBook,
    SaleOrder : SaleOrder

});

const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['isSideBar' , 'TransferIn', "Location" , "Store" ,"Openinginventory",  "StockReplacement","OrderBooker","PurchaseOrder","City","sidebarOptions" , "SubCity", "users1" , "Category" , "Vendor" , "MasterSku", "UsersRights" ,  "UsersRole", "Brand",   "Zone", "Region", "Terrotory" , "ChannelType", "Channel", "subChannel"]
};


const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export const persistor = persistStore(store);
