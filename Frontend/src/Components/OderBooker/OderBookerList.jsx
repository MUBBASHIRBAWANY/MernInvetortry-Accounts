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
import { deleteDataFunction, getDataFundtion } from '../../Api/CRUD Functions';
import { fetchOrderBooker } from '../../Redux/Reducers/OrderBookerReducer';
import { fetchTerrotory } from '../../Redux/Reducers/TerrotoryReducer';

const OderBookerList = () => {
  const [rows, setRows] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [Terrotory, setTerrotory] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const [deleteR, setdeleteR] = useState(false)
  const getData = async () => {
    try {
      const data = await getDataFundtion("/OrderBooker")
      const Terrotory = await getDataFundtion("/Terrotory")
      setTerrotory(Terrotory.data)
      const list = data.data
      dispatch(fetchOrderBooker(list))
      dispatch(fetchTerrotory(Terrotory.data))
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
    navigate(`/OrderBookerEdit/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);

    setRows(rows.filter((row) => row._id !== selectedId));
    deleteDataFunction(`/OrderBooker/deleteOrderBooker/${selectedId}`)

  };
  const columns = [

    { field: 'masterCode', headerName: 'Master Code', width: 250, },
    { field: 'code', headerName: 'Order Booker Code', width: 250, },
    { field: 'OrderBookerName', headerName: 'Name', width: 450, },
    { field: 'salesFlowRef', headerName: 'Sales Flow Ref', width: 250, },

    {
      field: 'Terrotory', headerName: 'Terrotory', width: 200, renderCell: (params) => {
        const Terrotory1 = Terrotory.find(Terrotory => Terrotory._id == params.formattedValue);
        return Terrotory1 ? `${Terrotory1.TerrotoryName} (${Terrotory1.code})` : 'No Master Sku';
      }
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
  )
}

export default OderBookerList