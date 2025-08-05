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
import { fetchproduct } from '../../Redux/Reducers/ProductReducer';
import { fetchStockReplacement } from '../../Redux/Reducers/StockReplacement.JS';
import { fetchClient } from '../../Redux/Reducers/ClientReducer';


const StockReplacementList = () => {
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
  const Customer = useSelector((state) => state.Client?.client)
  const StockReplacement = useSelector((state) => state.StockReplacement.StockReplacement)

  const getData = async () => {
    console.log("first");
    setLoading(true);
    try {
      const response = await getDataFundtion(`/StockReplacement`);
      const product = await getDataFundtion("/product");
      const Customers = await getDataFundtion("/customer");
      console.log(product.data)
      const list = response.data;
      dispatch(fetchClient(Customers.data));
      dispatch(fetchproduct(product.data))
      dispatch(fetchStockReplacement(list))
      setRows(list);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };





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
      navigate(`/StockReplacementEdit/${id}`)

    }

  };
  const handleViewClick = (id) => {
    navigate(`/StockReplacementView/${id}`)
  }
  const handleDeleteClick = (id) => {
    const isPost = StockReplacement.find((item) => item._id == id).PostStatus
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
    const isTrue = rows.find((item) => item._id == selectedId).PostStatus
    if (isTrue == false) {
      setRows(rows.filter((row) => row._id !== selectedId));
      deleteDataFunction(`/StockReplacement/StockReplacementDelete/${selectedId}`)
    } else {
      toast.error("first Unpost Replacement")
    }


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
      field: 'ReplacementDate',
      headerName: 'Replacement Date',
      width: 200,
      renderCell: (params) => formatDate(params.value), // Use .value
    },
    {
      field: 'ReplacementNumber',
      headerName: 'Replacement number',
      width: 200,
    },
    {
      field: 'SalesFlowRef',
      headerName: 'Sales Flow Ref',
      width: 200,
    },
    
    {
      field: 'ReplacementData',
      headerName: 'Total Products',
      width: 150,
      renderCell: (params) => params?.row?.ReplacementData?.length || 0,
    },
    {
      field: 'Total Amount From',
      headerName: 'Total Amount From',
      width: 250,
      renderCell: (params) =>
        params.row.ReplacementData?.reduce((sum, item) => sum + Number(item.fromValue), 0).toFixed(2)
    },
    {
      field: 'Total Value To',
      headerName: 'Total Value To',
      width: 250,
      renderCell: (params) =>
        params.row.ReplacementData?.reduce((sum, item) => sum + Number(item.ToValue), 0).toFixed(2)
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

export default StockReplacementList