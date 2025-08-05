import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { toast, ToastContainer } from 'react-toastify';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import { fetchZone } from '../../../Redux/Reducers/ZoneReducer';
import { fetchVendor } from '../../../Redux/Reducers/VendorReducer';


const Zonelist = () => {
  const [rows, setRows] = useState();
      const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
      const [selectedId, setSelectedId] = useState(null);
      const navigate = useNavigate()
      const dispatch = useDispatch()
      const UserRihts = useSelector((state) => state.UsersRights.UserRights)
      const category = useSelector((state) => state.Category.category)
      const Vendor = useSelector((state) => state.Vendor.state)
      const [deleteR, setdeleteR] = useState(false)
      const DeleteRight = "CategoryDelete"
      const pageName = "CategoryList"
      const getData = async () => {
          try {
              const data = await getDataFundtion("/zone")
              const vendor = await getDataFundtion("/vendor")
              console.log(data.data)
              const list = data.data
              
              dispatch(fetchVendor(vendor.data))
              dispatch(fetchZone(list))
              setRows(list)
          } catch (err) {
              console.log(err)
          }
  
      }
        useEffect(() => {
        
        getData()
    }, [])
  const handleEditClick = (id) => {
    console.log(id)
    navigate(`/Zoneedit/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    setRows(rows.filter((row) => row._id !== selectedId));
    deleteDataFunction(`zone/deleteZone/${selectedId}`)
      }
    

  const columns = [
    { field: 'code', headerName: 'Zone Code', width: 250, },
    { field: 'ZoneName', headerName: 'Zone Name', width: 250, },
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

export default Zonelist