import express from "express";
import { CreateSaleOrderDC, DeleteSaleOrderDC, GetAllSaleOrderDC, LastSaleOrderDC, updateOrderStatusDC, UpdateSaleOrderDC } from "../Controllar/SaleOrderDcControllar.js";
const SaleOrderRouter = express.Router()


SaleOrderRouter.post('/', CreateSaleOrderDC )
SaleOrderRouter.put('/updateSaleOrder/:id', UpdateSaleOrderDC)
SaleOrderRouter.get("/", GetAllSaleOrderDC)
SaleOrderRouter.get("/lastcode", LastSaleOrderDC)
SaleOrderRouter.delete("/deleteSaleOrder/:id", DeleteSaleOrderDC)
SaleOrderRouter.put("/ChangeStatus/:id" , updateOrderStatusDC)


export default SaleOrderRouter