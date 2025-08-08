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
import { fetchSalesInvoice } from '../../Redux/Reducers/SalesInvoiceReducer';
import { fetchClient } from '../../Redux/Reducers/ClientReducer';
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';
import { fetchOrderBooker } from '../../Redux/Reducers/OrderBookerReducer';
import { fetchStore } from '../../Redux/Reducers/StoreReducer';
import { fetchLocation } from '../../Redux/Reducers/LocationReducer';
import { fetchTotalProducts } from '../../Redux/Reducers/TotalProductsReducer';
import { fetchOrderDc } from '../../Redux/Reducers/OrderDCReducer';

const SalesInvoiceList = () => {
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
  const category = useSelector((state) => state.Category.category)
  const Client = useSelector((state) => state.Client.client)
  

  const getData = async () => {
    console.log("first");
    setLoading(true);
    try {
      const response = await getDataFundtion(`/SaleInvoice/getLimitedSaleInvoice`);
      const customer = await getDataFundtion("/customer");
      const product = await getDataFundtion("/product");
      const orderBooker = await getDataFundtion("/OrderBooker");
      const store = await getDataFundtion("/store");
      const Location = await getDataFundtion('/Location')
      const AllProducts = await getDataFundtion("/TotalProduct")
      const onTrueDc = await getDataFundtion("DcOrder/OnlyTrue")
      const list = response.data;
      dispatch(fetchLocation(Location.data))
      dispatch(fetchStore(store.data));
      dispatch(fetchproduct(product.data));
      dispatch(fetchClient(customer.data));
      dispatch(fetchOrderBooker(orderBooker.data));
      dispatch(fetchSalesInvoice(list));
      dispatch(fetchOrderDc(onTrueDc.data))
      dispatch(fetchTotalProducts(AllProducts.data))
      setRows(list);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
    getAllSaleInvoice()
  };

  const getAllSaleInvoice = async () => {
    const res = await getDataFundtion("/saleInvoice")
    console.log("first")
    const list = res.data
    console.log(res)
    const sortedInvoice = [...list].sort((a, b) => a.SalesInvoice - b.SalesInvoice)
    dispatch(fetchSalesInvoice(sortedInvoice));
    setRows(list);

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
    console.log("useEffect triggered", page, pageSize);
    getData();
  }, [page, pageSize]);
  const handleEditClick = (id) => {
    const isPost = rows.find((item) => item._id == id).PostStatus
    if (isPost == true) {
      return toast.error('first unpost for edit')
    }
    else {
      navigate(`/SalesInvoiceEdit/${id}`)

    }

  };
  const handleViewClick = (id) => {
    navigate(`/SalesInvoiceView/${id}`)
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

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);

    setRows(rows.filter((row) => row._id !== selectedId));
    deleteDataFunction(`/SaleInvoice/SaleInvoiceDelete/${selectedId}`)

  }
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
      field: 'SalesInvoiceDate',
      headerName: 'Invoice Date',
      width: 200,
      renderCell: (params) => formatDate(params.value), // Use .value
    },
    {
      field: 'SalesInvoice',
      headerName: 'Invoice #',
      width: 200,
    },
    {
      field: 'SalesFlowRef',
      headerName: 'Sales Flow Ref',
      width: 150,
    },
    {
      field: 'Store',
      headerName: 'Store',
      width: 150,
    },
    {
      field: 'Client',
      headerName: 'Client',
      width: 300,
      renderCell: (params) => {
        const vendor1 = Client.find(vendor => vendor._id === params.value);
        return vendor1 ? `${vendor1.CutomerName} (${vendor1.code})` : 'Vendor Not Found';
      },
    },
    {
      field: 'Total Products',
      headerName: 'Total Products',
      width: 80,
      renderCell: (params) => params?.row?.SalesData?.length || 0,
    },
    {
      field: 'Total Gst',
      headerName: 'Total GST',
      width: 120,
      renderCell: (params) =>
        params.row.SalesData?.reduce((sum, item) => sum + Number(item.Gst), 0).toFixed(2)
    },
    {
      field: 'NetAmount',
      headerName: 'Net Amount',
      width: 120,
      renderCell: (params) =>
        params.row.SalesData?.reduce((sum, item) => sum + Number(item.netAmunt), 0).toFixed(2)
    },
    {
      field: 'PostStatus',
      headerName: 'status',
      width: 80,
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
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
  const check = (num) => {
    console.log(num)
  }
  return (

    <div style={{ margin: 20, height: "70%", width: '80vw' }}>
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
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default SalesInvoiceList