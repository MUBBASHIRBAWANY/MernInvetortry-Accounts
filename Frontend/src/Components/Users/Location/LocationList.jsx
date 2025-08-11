import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLocation } from '../../../Redux/Reducers/LocationReducer';
import { useNavigate } from 'react-router-dom';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import { toast, ToastContainer } from 'react-toastify';

const LocationList = () => {
  const [rows, setRows] = useState();
  const dispatch = useDispatch()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate()
  const [deleteR, setdeleteR] = useState(false)


  const getData = async () => {
    const data = await getDataFundtion("/Location")
    const list = data.data
    dispatch(fetchLocation(list))
    setRows(list)
  }

  const DeleteRight = "Delete Location"
  const pageName = "List Location"
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)

  const checkAcess = async () => {
    const allowAcess = await UserRihts.find((item) => item == DeleteRight)
    console.log(allowAcess)
    if (allowAcess) {
      setdeleteR(true)
    }
    const viweAcess = await UserRihts.find((item) => item == pageName)
    console.log(viweAcess)
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
    navigate(`/LocationEdit/${id}`)
  };

  const handleDeleteClick = async (id) => {
    setSelectedId(id);
    const isDeleteable = await getDataFundtion(`/Store/getStoreByLocation/${id}`);
    if (isDeleteable.data.length > 0) {
      return toast.error("This Location is in use by Store, You can't delete it");
    }
    else {
      setOpenDeleteDialog(true);
    }
  };

  const handleConfirmDelete = async () => {    
    setOpenDeleteDialog(false);
    console.log(deleteR)
    if (deleteR) {
      setRows(rows.filter((row) => row._id !== selectedId));
    await deleteDataFunction(`/Location/deletelocation/${selectedId}`)
            toast.success("Data Delete")
    
    }else{
      toast.error("Access Denied")

    }
  };

  const columns = [
    { field: 'code', headerName: 'Code', width: 450, },
    { field: 'LocationName', headerName: 'Location', width: 450, },
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

    <div style={{ margin: 20, height: "70%", width: '90%' }}>
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
  )
}

export default LocationList