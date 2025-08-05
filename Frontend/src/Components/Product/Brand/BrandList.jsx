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
import { fetchbrand } from "../../../Redux/Reducers/BrandRecducer"
import { fetchCategory } from "../../../Redux/Reducers/CategoryReducer"
import { toast, ToastContainer } from 'react-toastify';
import { fetchVendor } from '../../../Redux/Reducers/VendorReducer';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';

const BrandList = () => {
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
            const data = await getDataFundtion("/brand")
            const Category = await getDataFundtion("/Category")
            const vendor = await getDataFundtion("/vendor")
            console.log(data.data)
            const list = data.data
            console.log(Category.data)
            dispatch(fetchVendor(vendor.data))
            dispatch(fetchCategory(Category.data))
            dispatch(fetchbrand(list))
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
        navigate(`/brandEdit/${id}`)
    };

    const handleDeleteClick = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        setOpenDeleteDialog(false);
        if (deleteR) {
            const data = await getDataFundtion(`masterSku/mskubybrand/${selectedId}`)
            if (data.data.length === 0) {
                setRows(rows.filter((row) => row._id !== selectedId));
                deleteDataFunction(`brand/deleteBrand/${selectedId}`)
            }
            else {
                toast.error(`It is used in Master Sku ${data.data[0].MasterSkuName}`)
            }

        }
        else {
            toast.error("Access Denied")
        }
    };
    const columns = [
        { field: 'mastercode', headerName: 'Mster code', width: 200, },
        { field: 'code', headerName: 'Brand Code', width: 250, },
        { field: 'BrandName', headerName: 'Brand Name', width: 250, },
        { field: 'salesFlowRef', headerName: 'sales Flow Ref', width: 250, },
        {
            field: 'category', headerName: 'Category', width: 200, renderCell: (params) => {
                const Category1 = category.find(Category => Category._id == params.formattedValue);
                return Category1 ? `${Category1.CategoryName} (${Category1.code})` : 'No Master Sku';
            }
        },
        {
            field: 'vendor',
            headerName: 'Vendor',
            width: 200,
            renderCell: (params) => {
                const mastercode = params.row.mastercode || '';
                const vendorCode = mastercode.slice(0, 2);
                const Vendor1 = Vendor.find(Vendor => Vendor.code == vendorCode);
                return Vendor1 ? `${Vendor1.VendorName} (${Vendor1.code})` : 'No Vendor';
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

export default BrandList