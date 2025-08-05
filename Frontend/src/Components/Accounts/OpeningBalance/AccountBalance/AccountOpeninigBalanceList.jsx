import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { deleteDataFunction, getDataFundtion } from '../../../../Api/CRUD Functions';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { fetchAccountOpeningReducer } from '../../../../Redux/Reducers/AccountOpeningReducer';
import { fetchChartofAccounts } from '../../../../Redux/Reducers/ChartofAccountsReduser';


const AccountOpeningBalanceList = () => {
    const [rows, setRows] = useState();
    const [deleteR, setdeleteR] = useState(false)
    const dispatch = useDispatch()
    const [selectedId, setSelectedId] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const editOpeningAccount = useSelector((state) => state.AccountOpeningReducer.AccountOpeningReducer)
    console.log(editOpeningAccount)

    const navigate = useNavigate()
    const getData = async () => {
        const data = await getDataFundtion("/AccountOpening")
        const ChartofAccount = await getDataFundtion("/ChartofAccounts")
        
        dispatch(fetchChartofAccounts(ChartofAccount.data))
        dispatch(fetchAccountOpeningReducer(data.data))
        setRows(data.data)
    }

    useEffect(() => {
        getData()
    }, [])

    const handleEditClick = (id) => {
        const check = editOpeningAccount.find((item) => item._id == id).Status
        if (check == "false") {
            navigate(`/AccountOpeningEdit/${id}`)
        }
        else {
            toast.error("first unpost")
        }
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        const check = editOpeningAccount.find((item) => item._id == id).Status
        setOpenDeleteDialog(true);
        if (check == "false") {
        }
        else {
            toast.error("first unpost")
        }
    };

    const handleViweClick = (id) => {
        console.log(id)
        navigate(`/AccountOpeningViwe/${id}`)
    }

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        setRows(rows.filter((row) => row._id !== selectedId));
        const res = deleteDataFunction(`/AccountOpening/deleteAccountOpening/${selectedId}`)
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).replace(",", ""); 
    };

    const columns = [
        { field: 'DateStart', headerName: 'DateStart', width: 150, renderCell: (params) => formatDate(params.value), },
        { field: 'DateEnd', headerName: 'DateEnd', width: 250, renderCell: (params) => formatDate(params.value), },
        {
            field: 'AccountsData', headerName: 'Total Inventory', width: 200,
            renderCell: (params) => {
                return params.value.length;
            },
        },
        {
            field: 'Status', headerName: 'Status', width: 250, renderCell: (params) => params.value == "Open" ? "Open" :
                params.value == "UnPost" ? "UnPost" : params.value == "Close" ? "Close" : "False"
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
                    onClick={() => handleViweClick(id)}
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
    )
}

export default AccountOpeningBalanceList