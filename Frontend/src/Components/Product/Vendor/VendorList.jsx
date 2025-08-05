import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios, { all } from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchVendor } from "../../../Redux/Reducers/VendorReducer"
import { toast, ToastContainer } from 'react-toastify';
import { deleteDataFunction, getDataFundtion } from "../../../Api/CRUD Functions"
import { fetchStore } from '../../../Redux/Reducers/StoreReducer';
import { fetchChartofAccounts } from '../../../Redux/Reducers/ChartofAccountsReduser';
import { fetchAdminReducer } from '../../../Redux/Reducers/AdminReducer';


const VendorList = () => {
  const [rows, setRows] = useState();
  const [deleteR, setdeleteR] = useState(false)
  const dispatch = useDispatch()
  const [selectedId, setSelectedId] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate()
  const adminId = "68903ec2664155e11db10367"
  const getData = async () => {
    const res = await getDataFundtion(`/Administrative/get/${adminId}`)
    const data = await getDataFundtion("vendor/")
    const ChartofAccounts = await getDataFundtion("/ChartofAccounts")
    const store = await getDataFundtion("/store");
    dispatch(fetchChartofAccounts(ChartofAccounts.data))
    dispatch(fetchStore(store.data));
    const list = data.data
    dispatch(fetchVendor(list))
    dispatch(fetchAdminReducer(res.data))

    setRows(list)
  }

  const DeleteRight = "VenderDelete"
  const pageName = "VenderList"
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const checkAcess = async () => {
    const allowAcess = await UserRihts.find((item) => item == DeleteRight)
    if (allowAcess) {
      setdeleteR(true)
    }
    const viweAcess = await UserRihts.find((item) => item == pageName)
    if (!viweAcess) {
      navigate("/")
    }


  }
  useEffect(() => {
    checkAcess()
    getData()
  }, [])

  const handleEditClick = (id) => {
    console.log(id)
    navigate(`/VendorUpdate/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    console.log(selectedId)
    if (deleteR) {
      setRows(rows.filter((row) => row._id !== selectedId));
      
      const res = await deleteDataFunction(`/vendor/deleteVendor/${selectedId}`)
      console.log(res)
    } else {
      toast.error("Access Denied")
    }
    // console.log(res)
  };

  const columns = [
    { field: 'code', headerName: 'Vendor code', width: 150, },
    { field: 'VendorName', headerName: 'Vendor Name', width: 250, },
    { field: 'phone', headerName: 'Phone no', width: 200, },
    { field: 'email', headerName: 'email', width: 250, },
    { field: 'Address', headerName: 'Address', width: 150, },
    { field: 'NTN', headerName: 'NTN', width: 150, },
    { field: 'STN', headerName: 'STN', width: 100, },
    { field: 'salesFlowRef', headerName: 'Sales Flow Ref', width: 100, },



    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 130,
      getActions: ({ id }) => [
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

    <div style={{ margin: 20, height: "70%", width: '80vw' }}>
      <ToastContainer />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        getRowId={(row) => row._id}
        rowsPerPageOptions={[5]}
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

  );
}

export default VendorList