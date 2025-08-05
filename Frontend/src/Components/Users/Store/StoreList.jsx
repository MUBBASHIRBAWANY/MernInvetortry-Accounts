import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStore } from '../../../Redux/Reducers/StoreReducer';
import { useNavigate } from 'react-router-dom';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import { fetchLocation } from '../../../Redux/Reducers/LocationReducer';
import { toast, ToastContainer } from 'react-toastify';
const StoreList = () => {
    const [rows, setRows] = useState();
    const dispatch = useDispatch()
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    let Loction = useSelector((state) => state.Location.Location)

    const navigate = useNavigate()

    const getData = async () => {
        const data = await getDataFundtion("/Store")
        const Location = await getDataFundtion("/Location")
        
        const list = data.data
        dispatch(fetchStore(list))
        dispatch(fetchLocation(Location.data))
        setRows(list)
    }
    useEffect(() => {
        getData()
    }, [])

    const handleEditClick = (id) => {
        console.log(id)
        navigate(`/StoreEdit/${id}`)
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        try{
            await deleteDataFunction(`/Store/deleteStore/${selectedId}`)
            setRows(rows.filter((row) => row._id !== selectedId));
            setOpenDeleteDialog(false);
        }
        catch(err){
            toast.error(err.response.data)
        }
    };

    const columns = [
        { field: 'code', headerName: 'Code', width: 450, },
        { field: 'StoreName', headerName: 'Location', width: 450, },
        {
            field: 'Location', headerName: 'Location', width: 150, renderCell: (params) => {
                const Location = Loction.find(Loction => Loction._id == params.formattedValue);
                return Location ? Location.LocationName : 'No Location Assigned';
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

export default StoreList