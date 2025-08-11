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
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions.jsx';
import { fetchChartofAccounts } from '../../../Redux/Reducers/ChartofAccountsReduser.js';


const ChartofAccountsList = () => {
  const [rows, setRows] = useState();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null);
  const pageName = "List Chart of Accounts"
  const DeleteRight = "Delete Chart of Accounts"
  const dispatch = useDispatch()
  const [deleteR, setdeleteR] = useState(false)
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)




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
  const getData = async () => {
    try {
      const data = await getDataFundtion("/ChartofAccounts")
      const list = data.data
      dispatch(fetchChartofAccounts(list))
      const setForRows1 = list.filter((item) => item.AccountCode.startsWith(1))
      const setForRows2 = list.filter((item) => item.AccountCode.startsWith(2))
      const setForRows3 = list.filter((item) => item.AccountCode.startsWith(3))
      const setForRows4 = list.filter((item) => item.AccountCode.startsWith(4))
      const setForRows5 = list.filter((item) => item.AccountCode.startsWith(5))
      const setForRows = setForRows1.concat(setForRows2).concat(setForRows3).concat(setForRows4).concat(setForRows5)
      const setForRowsWithName = setForRows.map((item) => {
        return ({
          AccountCode: item.AccountCode,
          AccountName: item.AccountName,
          Stage: "Stage" + item.Stage,
          _id: item._id,
          Stage1: list.find((item1) => item1._id == item.Stage1)?.AccountName,
          Stage2: list.find((item1) => item1._id == item.Stage2)?.AccountName,
          Stage3: list.find((item1) => item1._id == item.Stage3)?.AccountName
        })
      })

      setRows(setForRowsWithName)

    } catch (err) {
      console.log(err)
    }

  }

  useEffect(() => {
    getData()
    checkAcess()
  }, [])

  const handleEditClick = (id) => {
    console.log(id)
    navigate(`/ChartofAccountsEdit/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDeleteDialog(false);
    if (deleteR) {

      setRows(rows.filter((row) => row._id !== selectedId));
      deleteDataFunction(`/ChartofAccounts/deletChartofAccounts/${selectedId}`)
    } else {
      toast.error("Access Denied")
    }
  };
  const columns = [
    { field: 'AccountCode', headerName: 'Account Code', width: 250, },
    { field: 'AccountName', headerName: 'Accounts Name', width: 450, },
    { field: 'Stage', headerName: 'Stage', width: 200 },
    { field: 'Stage1', headerName: 'Stage 1', width: 200 },
    { field: 'Stage2', headerName: 'Stage 2', width: 200 },
    { field: 'Stage3', headerName: 'Stage 3', width: 200 },

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

export default ChartofAccountsList