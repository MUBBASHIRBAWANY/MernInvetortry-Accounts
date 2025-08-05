import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserRole } from "../../../Redux/Reducers/userRoleReduser"
import { toast, ToastContainer } from 'react-toastify';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
const UserRoleList = () => {
  const [rows, setRows] = useState([]);
  const dispatch = useDispatch()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteR, setdeleteR] = useState(false)
  const navigate = useNavigate()
  const pageName = "UserRoleList"
  const DeleteRight = "UserRoleDelete"
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const UserDetial = useSelector((state) => state.LoginerReducer.userDetail)
  
  console.log(UserDetial)
    const getData = async () => {
      try{
        const data = await getDataFundtion(`/userRole?pageName=${pageName}&role=${UserDetial.selectRole}` )
        const list = data.data
        console.log(list)
        dispatch(fetchUserRole(list))
        setRows(list)

      }catch(err){
        console.log(err)
      }
  }
  const checkAcess = async () => {
    const   allowAcess = await UserRihts.find((item) => item == DeleteRight)
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
    checkAcess()

    getData()
  }, [])


  const handleEditClick = (id) => {
    console.log(id)
    navigate(`/userRoleEdit/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    console.log(deleteR)
    if (deleteR) {
      setRows(rows.filter((row) => row._id !== selectedId));
        deleteDataFunction(`/userRole/DeleteRole/${selectedId}`)
    } else {
      toast.error("Access Denied")
    }
  };

  const columns = [
    {
      field: 'RoleName',
      headerName: 'Role Name',
      width: 350,
    },
    {
      field: 'Roles',
      headerName: 'Number of Roles',
      width: 150,
      // 👇 Display the count instead of array
      valueGetter: (params) => params.length,
    },
    {
      field: 'createdBy',
      headerName: 'Created By',
      width: 150,
    },
    {
      field: 'createDate',
      headerName: 'Create Date',
      width: 150,
    },
    {
      field: 'updatedBy',
      headerName: 'Updated By',
      width: 150,
    },
    {
      field: 'updateDate',
      headerName: 'Updated Date',
      width: 150,
    },
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

    <div style={{ margin: 20, height: "70%", width: '80vw'}}>
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

export default UserRoleList