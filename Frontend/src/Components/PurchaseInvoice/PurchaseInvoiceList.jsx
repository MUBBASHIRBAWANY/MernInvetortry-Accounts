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
import { fetchPurchaseInvoice } from '../../Redux/Reducers/PurchaseInvoiceReducer';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';
import { fetchLocation } from '../../Redux/Reducers/LocationReducer';
import { fetchStore } from '../../Redux/Reducers/StoreReducer';
import { fetchChartofAccounts } from '../../Redux/Reducers/ChartofAccountsReduser';
import { fetchAdminReducer } from '../../Redux/Reducers/AdminReducer';

const PurchaseInvoiceList = () => {
  const [rows, setRows] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const category = useSelector((state) => state.Category.category)
  const Vendor = useSelector((state) => state.Vendor.state)
  const Store = useSelector((state) => state.Store.Store)
  console.log(Store)
  const PurchaseInvoice = useSelector((state) => state.PurchaseInvoice.PurchaseInvoice)


  const getData = async () => {
    setLoading(true)
    try {
      const AdminiD = "68903ec2664155e11db10367"
      const data = await getDataFundtion("/PurchaseInvoice")
      const vendor = await getDataFundtion("/vendor")
      const product = await getDataFundtion("/product")
      const loction = await getDataFundtion('/Location')
      const Store = await getDataFundtion("/store")
      const Accounts = await getDataFundtion('/ChartofAccounts')
      const res = await getDataFundtion(`/Administrative/get/${AdminiD}`)
console.log(res)
      const list = data.data
      const PurchaseInvoiceSorted = [...list].sort((a, b) => a.PurchaseInvoice - b.PurchaseInvoice)
      console.log(PurchaseInvoiceSorted)
      dispatch(fetchChartofAccounts(Accounts.data))
      dispatch(fetchproduct(product.data));
      dispatch(fetchLocation(loction.data))
      dispatch(fetchStore(Store.data))
      dispatch(fetchVendor(vendor.data))
      dispatch(fetchAdminReducer(res))
      dispatch(fetchPurchaseInvoice(PurchaseInvoiceSorted))
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
    const isPost = PurchaseInvoice.find((item) => item._id == id).PostStatus
    if (isPost == true) {
      return toast.error('first unpost for edit')
    }
    else {
      navigate(`/PurchaseInvoiceEdit/${id}`)

    }

  };
  const handleViewClick = (id) => {
    navigate(`/PurchaseInvoiceView/${id}`)
  }
  const handleDeleteClick = (id) => {
    const isPost = PurchaseInvoice.find((item) => item._id == id).PostStatus
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
    deleteDataFunction(`PurchaseInvoice/PurchaseInvoiceDelete/${selectedId}`)

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
      field: 'PurchaseInvoiceDate',
      headerName: 'Invoice Date',
      width: 200,
      renderCell: (params) => formatDate(params.value), // Use .value
    },
    {
      field: 'PurchaseInvoice',
      headerName: 'Invoice #',
      width: 200,
    },
    {
      field: 'Store',
      headerName: 'Store',
      width: 100,
      
    },
    {
      field: 'SalesFlowRef',
      headerName: 'Sales Flow Ref',
      width: 200,
    },
    {
      field: 'Vendor',
      headerName: 'Vendor',
      width: 200,
      renderCell: (params) => {
        const vendor1 = Vendor.find(vendor => vendor._id === params.value);
        return vendor1 ? `${vendor1.VendorName} (${vendor1.code})` : 'Vendor Not Found';
      },
    },
    {
      field: 'Total Products',
      headerName: 'Total Products',
      width: 250,
      renderCell: (params) => params?.row?.PurchaseData?.length || 0,
    },
    {
      field: 'Total Gst',
      headerName: 'Total GST',
      width: 250,
      renderCell: (params) =>
        params.row.PurchaseData?.reduce((sum, item) => sum + Number(item.Gst), 0).toFixed(2) || 0
    },
    {
      field: 'NetAmount',
      headerName: 'Net Amount',
      width: 250,
      renderCell: (params) =>
        params.row.PurchaseData?.reduce((sum, item) => sum + Number(item.netAmunt), 0).toFixed(2) || 0
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

export default PurchaseInvoiceList