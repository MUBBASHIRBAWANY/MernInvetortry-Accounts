import React, { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { fetchproduct } from '../../../Redux/Reducers/ProductReducer';
import { fetchMasterSku } from '../../../Redux/Reducers/MasterSkuReducer';
import { fetchbrand } from '../../../Redux/Reducers/BrandRecducer';
import { fetchCategory } from '../../../Redux/Reducers/CategoryReducer';
import { fetchVendor } from '../../../Redux/Reducers/VendorReducer';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { deleteDataFunction, getDataFundtion } from '../../../Api/CRUD Functions';
import ExcelExport from '../../Global/ExcalData';
const ProductList = () => {
  const DeleteRight = "ProductDelete"
  const pageName = "ProductList"
  const [rows, setRows] = useState();
  const dispatch = useDispatch()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [msku, setMSku] = useState([])
  const [cat, setCat] = useState([])
  const [prBrand, setprBrand] = useState([])
  const [prVendor, setPrVendor] = useState([])
  const navigate = useNavigate()
  const [deleteR, setdeleteR] = useState(false)
  const UserRihts = useSelector((state) => state.UsersRights.UserRights)
  const Vendor = useSelector((state) => state.Vendor.state)
  const Category = useSelector((state) => state.Category.category)
  const Brand = useSelector((state) => state.Brand.brand)



  const getData = async () => {
    const data = await getDataFundtion("/product")
    setRows(data.data)
    dispatch(fetchproduct(data.data))
    dispatch(fetchMasterSku(mastersku.data))
    dispatch(fetchCategory(category.data))
    dispatch(fetchbrand(brand.data))
    dispatch(fetchVendor(vendor.data))

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
    navigate(`/Productedit/${id}`)
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setOpenDeleteDialog(false);
    if (deleteR) {
      setRows(rows.filter((row) => row._id !== selectedId));
      deleteDataFunction(`/product/deleteProduct/${selectedId}`)
    }
    else {
      toast.error("Access Denied")
    }
  };

  const initialState = {
    columns: {
      columnVisibilityModel: {
        SalesRate: false, 
        SaleTaxPercent : false
      },
    },
  };
  const columns = [
    
    { field: 'code', headerName: 'Product code', width: 150,  },
    { field: 'ProductName', headerName: 'Product Name', width: 200, },
    { field: 'OpeningRate', headerName: 'Opening Rate', width: 150, },
    { field: 'TPPurchase', headerName: 'TP Purchase', width: 150, },
    { field: 'TPSale', headerName: 'TP Sale', width: 150, hide : true },
    { field: 'RetailPrice', headerName: 'Retail Price', width: 150, hide : true },
    { field: 'SaleTaxPercent', headerName: 'Sale Tax Percent', width: 150, hide : true },
    { field: 'BoxinCarton', headerName: 'Box in Carton', width: 150,},
    { field: 'PcsinBox', headerName: 'Pcs in Box', width: 150,},
    { field: 'SaleTaxBy', headerName: 'Sale Tax By', width: 150,   renderCell: (params) => {
      return params.value == 1 ? "By Amount" : "By Rate";
    }},
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
  console.log(columns)
  return (
    <div style={{ margin: 20, height: "70%", width: '80vw'}}>
      <ExcelExport />
      <ToastContainer />
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        initialState={initialState}
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

export default ProductList