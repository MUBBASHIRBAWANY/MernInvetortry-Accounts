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
import { fetchCategory } from '../../../Redux/Reducers/CategoryReducer';
import { toast, ToastContainer } from 'react-toastify';
import { fetchVendor } from '../../../Redux/Reducers/VendorReducer';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const CategoryList = () => {
    const [rows, setRows] = useState();
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [vendor, setVendor] = useState()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const UserRihts = useSelector((state) => state.UsersRights.UserRights)
    const DeleteRight = "CategoryDelete"
    const pageName = "CategoryList"
    const [deleteR, setdeleteR] = useState(false)
    const getData = async () => {
        try {
            const data = await getDataFundtion("/Category")
            const vendor = await getDataFundtion("/vendor")
            setVendor(vendor.data)
            const list = data.data
            dispatch(fetchCategory(list))
            dispatch(fetchVendor(vendor.data))
            setRows(list)
        } catch (err) {
            console.log(err)
        }

    }
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
    useEffect(() => {
        checkAcess()

        getData()
    }, [])

    const handleEditClick = (id) => {
        console.log(id)
        navigate(`/CategoryEdit/${id}`)
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        if (deleteR) {
            const brandbycat = await getDataFundtion(`brand/getBrandByCat/${selectedId}`)
            console.log(brandbycat)
            if (brandbycat.data.length === 0) {
                setRows(rows.filter((row) => row._id !== selectedId));
                deleteDataFunction(`/Category/deleteCategory/${selectedId}`)
            }
            else{
                toast.error(`this category is used in Brand ${brandbycat.data[0].BrandName}`)
            }

        } else {
            toast.error("Access Denied")
        }
    };
    const columns = [
        { field: 'mastercode', headerName: 'Mster code', width: 200, },
        { field: 'code', headerName: 'CategoryCode', width: 250, },
        { field: 'CategoryName', headerName: 'Category', width: 450, },
        { field: 'salesFlowRef', headerName: 'Sales Flow Ref', width: 250, },

        {
            field: 'vendor', headerName: 'Vendor', width: 200, renderCell: (params) => {
                const vendor1 = vendor.find(vendor => vendor._id == params.formattedValue);
                return vendor1 ? `${vendor1.VendorName} (${vendor1.code})` : 'No Master Sku';
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

export default CategoryList