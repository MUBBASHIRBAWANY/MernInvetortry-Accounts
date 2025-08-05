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
import { fetchClient } from '../../Redux/Reducers/ClientReducer';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';
import { fetchTransferIn } from '../../Redux/Reducers/TransferInReducer';
import { fetchTotalProducts } from '../../Redux/Reducers/TotalProductsReducer';
import { fetchStore } from '../../Redux/Reducers/StoreReducer';
import { fetchLocation } from '../../Redux/Reducers/LocationReducer';


const TransferInList = () => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [pageSize, setPageSize] = useState(100);
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const store = useSelector((state) => state.Store.Store)
  const Location = useSelector((state) => state.Location.Location)

  const getData = async () => {
    console.log("first");
    setLoading(true);
    try {
      const response = await getDataFundtion("/TransferIn")
      const product = await getDataFundtion("/product");
      const Location = await getDataFundtion('/Location')
      const Store = await getDataFundtion('/store')
      const list = response.data.filter((item)=> item.PostStatus !== "Received");
      const data = await getDataFundtion('/TotalProduct')
      dispatch(fetchTotalProducts(data.data))
dispatch(fetchStore(Store.data))
dispatch((fetchLocation(Location.data)))
      const sortedInvoice = [...list].sort((a, b) => a.SalesInvoice - b.SalesInvoice)
      console.log(sortedInvoice)
      dispatch(fetchTransferIn(sortedInvoice));
      dispatch(fetchproduct(product.data))
      setRows(list);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };



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
    console.log("useEffect triggered", page, pageSize);
    getData();
  }, [page, pageSize]);

  const handleViewClick = (id) => {
    navigate(`/TransferinView/${id}`)
  }
  const handleDeleteClick = (id) => {
    const isPost = rows.find((item) => item._id == id).PostStatus
    if (isPost == true) {
      return toast.error('first unpost for delete')
    }
    else {

      setSelectedId(id);
      setOpenDeleteDialog(true);
    }
  };


  ;
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).replace(",", "");
  };
  const columns = [
    {
      field: 'TransferInDate',
      headerName: 'Invoice Date',
      width: 200,
      renderCell: (params) => formatDate(params.value), // Use .value
    },
    {
      field: 'TransferCode',
      headerName: 'TransferCode #',
      width: 200,
    },
    {
      field: 'LocationFrom',
      headerName: 'LocationFrom',
      width: 150,
      renderCell: ((params) => Location.find((item) => item._id == params.value)?.LocationName)
    },
    {
      field: 'StoreFrom',
      headerName: 'StoreFrom',
      width: 180,
      renderCell: ((params) => store.find((item) => item._id == params.value)?.StoreName)
    },
    {
      field: 'LocationTo',
      headerName: 'LocationTo',
      width: 150,
      renderCell: ((params) => Location.find((item) => item._id == params.value)?.LocationName)
    },
    {
      field: 'StoreTo',
      headerName: 'StoreTo',
      width: 150,
      renderCell: ((params) => store.find((item) => item._id == params.value)?.StoreName)
    },
    {
      field: 'SalesFlowRef',
      headerName: 'Sales Flow Ref',
      width: 200,
    },
    {
      field: 'Total Products',
      headerName: 'Total Products',
      width: 150,
      renderCell: (params) => params?.row?.TransferData?.length || 0,
    },
    {
      field: 'NetAmount',
      headerName: 'Net Amount',
      width: 250,
      renderCell: (params) =>
        params.row.TransferData?.reduce((sum, item) => sum + Number(item.GrossAmount), 0).toFixed(4)
    },
    {
      field: 'PostStatus',
      headerName: 'status',
      width: 100,
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

      ],
    },
  ];
  const check = (num) => {
    console.log(num)
  }
  return (

    <div style={{ margin: 20, height: "70%", width: '80vw'}}>
      <ToastContainer />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={[5]}
        loading={loading}
        getRowId={(row) => row._id}
        disableSelectionOnClick
      />
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete?</DialogTitle>
        <DialogActions>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TransferInList