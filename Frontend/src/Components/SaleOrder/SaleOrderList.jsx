import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { toast, ToastContainer } from 'react-toastify';
import { deleteDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import { fetchVendor } from "../../Redux/Reducers/VendorReducer"
import { fetchSaleOrder } from '../../Redux/Reducers/SaleOrderReducer.js';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';
import { fetchLocation } from '../../Redux/Reducers/LocationReducer';
import { fetchStore } from '../../Redux/Reducers/StoreReducer';
import { fetchChartofAccounts } from '../../Redux/Reducers/ChartofAccountsReduser';
import { fetchClient } from '../../Redux/Reducers/ClientReducer';
import { fetchOrderBooker } from '../../Redux/Reducers/OrderBookerReducer.js';

const SaleOrderList = () => {
    const [rows, setRows] = useState();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const category = useSelector((state) => state.Category.category)
    const OrderBooker = useSelector((state) => state.OrderBooker.OrderBooker)
    const Store = useSelector((state) => state.Store.Store)
    const Customer = useSelector((state) => state.Client.client)
    console.log(Store)
    const SaleOrder = useSelector((state) => state.SaleOrder.SaleOrder)


    const getData = async () => {
        setLoading(true)
        try {
            const data = await getDataFundtion("/SaleOrder")
            const Client = await getDataFundtion("/Customer")
            const product = await getDataFundtion("/product")
            const loction = await getDataFundtion('/Location')
            const Store = await getDataFundtion("/store")
            const Accounts = await getDataFundtion('/ChartofAccounts')
            const OderBooker = await getDataFundtion('/orderbooker')
            const list = data.data
            const SaleOrderSorted = [...list].sort((a, b) => a.SaleOrder - b.SaleOrder)
            console.log(SaleOrderSorted)
            dispatch(fetchChartofAccounts(Accounts.data))
            dispatch(fetchproduct(product.data));
            dispatch(fetchLocation(loction.data))
            dispatch(fetchStore(Store.data))
            dispatch(fetchClient(Client.data))
            dispatch(fetchSaleOrder(SaleOrderSorted))
            dispatch(fetchOrderBooker(OderBooker.data))
            setLoading(false)
            setRows(list)
        } catch (err) {
            console.log(err)
        }

    }
    const checkAcess = async () => {
        const allowAcess = await UserRihts.find((item) => item == DeleteRight)
        console.log(allowAcess)
        if (allowAcess) {
            setdeleteR(true)
        }
        const viweAcess = await UserRihts.find((item) => item == pageName)
        if (!viweAcess) {
            navigate("/")
        }
    }
    useEffect(() => {

        getData()
    }, [])

    const handleEditClick = (id) => {
        const isPost = SaleOrder.find((item) => item._id == id).PostStatus
        if (isPost == true) {
            return toast.error('first unpost for edit')
        }
        else {
            navigate(`/SaleOrderEdit/${id}`)

        }

    };
    const handleViewClick = (id) => {
        navigate(`/SaleOrderView/${id}`)
    }
    const handleDeleteClick = (id) => {
        const isPost = SaleOrder.find((item) => item._id == id).PostStatus
        if (isPost == true) {
            return toast.error('first unpost for delete')
        }
        else {

            setSelectedId(id);
            setOpenDeleteDialog(true);
        }
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);

        setRows(rows.filter((row) => row._id !== selectedId));
        deleteDataFunction(`SaleOrder/deleteSaleOrder/${selectedId}`)

    }
        ;
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).replace(",", ""); // Removes the comma
    };
    const columns = [
        {
            field: 'SaleOrderDate',
            headerName: 'Invoice Date',
            width: 200,
            renderCell: (params) => formatDate(params.value), // Use .value
        },
        {
            field: 'SaleOrderNumber',
            headerName: 'Order #',
            width: 200,
        },
        {
            field: 'OrderBookerId',
            headerName: 'Order Booker',
            width: 200,
            renderCell: (params) => {
                const OrderBookerId1 = OrderBooker.find(Store => Store._id === params.value);
                return OrderBookerId1 ? `${OrderBookerId1.OrderBookerName} (${OrderBookerId1.code})` : 'Store Not Found';
            },

        },
        {
            field: 'Store',
            headerName: 'Store',
            width: 100,
            renderCell: (params) => {
                const Store1 = Store.find(Store => Store._id === params.value);
                return Store1 ? `${Store1.StoreName} (${Store1.code})` : 'Store Not Found';
            },

        },

        {
            field: 'Customer',
            headerName: 'Customer',
            width: 200,
            renderCell: (params) => {
                const Customer1 = Customer.find(Customer => Customer._id === params.value);
                return Customer1 ? `${Customer1.CutomerName} (${Customer1.code})` : 'Vendor Not Found';
            },
        },
        {
            field: 'Total Products',
            headerName: 'Total Products',
            width: 250,
            renderCell: (params) => params?.row?.SaleOrderData?.length || 0,
        },
        {
            field: 'Amount',
            headerName: 'Amount',
            width: 250,
            renderCell: (params) =>
                params.row.SaleOrderData?.reduce((sum, item) => sum + Number(item.Amount), 0).toFixed(2) || 0
        },
        {
            field: 'Status',
            headerName: 'Status',
            width: 200,

        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 130,
            getActions: ({ id }) => [
                <GridActionsCellItem
                    icon={<VisibilityIcon />}
                    label="View"
                    onClick={() => handleViewClick(id)}
                    color="view"
                />,
                <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    onClick={() => handleEditClick(id)}
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={() => handleDeleteClick(id)}
                    color="error"
                />,
            ],
        },
    ];



    return (

        <div style={{ margin: `1vw`, height: "70%", width: '80vw' }}>
            <ToastContainer />
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                getRowId={(row) => row._id}
                rowsPerPageOptions={[5]}
                loading={loading}
                experimentalFeatures={{ newEditingApi: true }}
            />

            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Delete?</DialogTitle>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
                    <Button onClick={handleConfirmDelete} color="error">Delete</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default SaleOrderList