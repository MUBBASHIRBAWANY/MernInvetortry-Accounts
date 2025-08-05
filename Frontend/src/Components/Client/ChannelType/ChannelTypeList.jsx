import axios from 'axios';
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
import { fetchChannelType } from '../../../Redux/Reducers/ChanneTypelReducer.js';
import { toast, ToastContainer } from 'react-toastify';
import { fetchVendor } from '../../../Redux/Reducers/VendorReducer.js';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions.jsx';

const ChanneTypelList = () => {
    const [rows, setRows] = useState();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [vendor, setVendor] = useState()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [deleteR, setdeleteR] = useState(false)
    const getData = async () => {
        try {
            const data = await getDataFundtion("/chanelType")
            const vendor = await getDataFundtion("/vendor")
            setVendor(vendor.data)
            const list = data.data
            dispatch(fetchChannelType(list))
            dispatch(fetchVendor(vendor.data))
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
        navigate(`/ChannelTypeEdit/${id}`)
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        setRows(rows.filter((row) => row._id !== selectedId));
        deleteDataFunction(`/chanelType/deleteChannelType/${selectedId}`)

    };
    const columns = [
        { field: 'code', headerName: 'Channel Type Code', width: 250, },
        { field: 'ChanneTypeName', headerName: 'Channel Type', width: 450, },
  
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

export default ChanneTypelList