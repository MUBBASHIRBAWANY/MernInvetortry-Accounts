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
import { fetchsubChannel } from '../../../Redux/Reducers/SubChannelReducer.js';
import { toast, ToastContainer } from 'react-toastify';
import { fetchChannel } from '../../../Redux/Reducers/ChannelReducer.js';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions.jsx';


const SubChannelList = () => {
   const [rows, setRows] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [Channel, setChannel] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [deleteR, setdeleteR] = useState(false)
  const getData = async () => {
    try {
      const data = await getDataFundtion("/SubChannel")
      const list = data.data
      dispatch(fetchsubChannel(list))
      
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
    navigate(`/SubChannelEdit/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    setRows(rows.filter((row) => row._id !== selectedId));
    deleteDataFunction(`/SubChannel/deleteSubChannel/${selectedId}`)

  };
  const columns = [
    { field: 'code', headerName: 'Channel Code', width: 250, },
    { field: 'SubChanneName', headerName: 'SubChannel Name', width: 450, },
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

export default SubChannelList