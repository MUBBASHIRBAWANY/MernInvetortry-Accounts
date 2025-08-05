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
import { fetchChqBook } from '../../../Redux/Reducers/ChqBookReducer';
import { fetchChartofAccounts } from '../../../Redux/Reducers/ChartofAccountsReduser';
import { fetchAdminReducer } from '../../../Redux/Reducers/AdminReducer';
import VisibilityIcon from '@mui/icons-material/Visibility';


const ChqBookList = () => {
    const [rows, setRows] = useState();
    const [deleteR, setdeleteR] = useState(false)
    const dispatch = useDispatch()
    const [selectedId, setSelectedId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const navigate = useNavigate()
    const Account = useSelector((state) => state.ChartofAccounts.ChartofAccounts);

    const getData = async () => {
        const id = "687e14a624a274d5e844be49"
        const data = await getDataFundtion("/ChqBook")
        const Accounts = await getDataFundtion("/ChartofAccounts");
        const Admin = await getDataFundtion(`/Administrative/get/${id}`)
        dispatch(fetchChqBook(data.data));
        dispatch(fetchChartofAccounts(Accounts.data));
        dispatch(fetchAdminReducer(Admin.data))
        setRows(data.data)
    }

    const handleViewClick = (id) => {
        navigate(`/ChqBookView/${id}`)
    }



    useEffect(() => {
        getData()
    }, [])

    const handleEditClick = (id) => {
        console.log(id)
        navigate(`/ChqBookEdit/${id}`)
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        console.log(selectedId)
    setRows(rows.filter((row) => row._id !== selectedId));       
            let getCatByVendor = await deleteDataFunction(`/ChqBook/delete/${selectedId}`)

    
        // console.log(res)
    };

    const columns = [
        {
            field: 'Bank', headerName: 'Bank', width: 250,
            renderCell: (params) => {
                const Bank = params.value;
                const accountData = Account.find(acc => acc._id === Bank);

                return accountData ? accountData.AccountName : '';
            }
        },
        { field: 'Prefix', headerName: 'Prefix', width: 150, },
        { field: 'CheuquesStart', headerName: 'Chq Start', width: 250, },
        { field: 'CheuquesEnd', headerName: 'Chq End', width: 200, },
        {
            field: 'Total Chq', headerName: 'Total Chq', width: 150, renderCell: (params) => {
                const rows = params.row.CheuquesEnd - params.row.CheuquesStart + 1;
                return rows;

            }
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

export default ChqBookList